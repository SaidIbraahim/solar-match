"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { SolarPlanResult } from "@/lib/types";

interface PdfExportButtonProps {
  targetId: string;
  plan?: SolarPlanResult;
  disabled?: boolean;
}

export const PdfExportButton = ({
  targetId,
  plan,
  disabled,
}: PdfExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const translations = t();

  const handleExport = async () => {
    const target = document.getElementById(targetId);
    if (!target) {
      alert("Content not found. Please try again.");
      return;
    }

    setIsExporting(true);
    try {
      // Scroll to element to ensure it's visible
      target.scrollIntoView({ behavior: "instant", block: "start" });
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Wait for any images or dynamic content to load
      const images = target.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000); // Timeout after 2 seconds
        });
      });
      await Promise.all(imagePromises);

      // Create a completely isolated container with no external stylesheets
      // This prevents html2canvas from parsing oklab colors in CSS
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = target.offsetWidth + "px";
      tempContainer.style.backgroundColor = "#ffffff";
      document.body.appendChild(tempContainer);

      // Recursively clone element and convert all colors to RGB inline styles
      const createRGBClone = (original: HTMLElement): HTMLElement => {
        const clone = document.createElement(original.tagName.toLowerCase());
        
        // Copy text content
        if (original.children.length === 0) {
          clone.textContent = original.textContent;
        }
        
        // Get computed styles from original
        const computed = window.getComputedStyle(original);
        
        // Convert background color to RGB
        const bgColor = computed.backgroundColor;
        if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
          // Use canvas to force RGB conversion
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = bgColor;
            const rgb = ctx.fillStyle.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              clone.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            }
          }
        } else {
          clone.style.backgroundColor = "#ffffff";
        }
        
        // Convert text color to RGB
        const textColor = computed.color;
        if (textColor) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = textColor;
            const rgb = ctx.fillStyle.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              clone.style.color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            }
          }
        }
        
        // Copy essential layout styles
        clone.style.width = computed.width;
        clone.style.height = computed.height;
        clone.style.padding = computed.padding;
        clone.style.margin = computed.margin;
        clone.style.display = computed.display;
        clone.style.flexDirection = computed.flexDirection;
        clone.style.gap = computed.gap;
        clone.style.borderRadius = computed.borderRadius;
        clone.style.border = computed.border;
        clone.style.fontSize = computed.fontSize;
        clone.style.fontWeight = computed.fontWeight;
        clone.style.fontFamily = computed.fontFamily;
        clone.style.textAlign = computed.textAlign;
        
        // Recursively clone children (skip buttons)
        Array.from(original.children).forEach((child) => {
          if (child.tagName !== "BUTTON") {
            const childClone = createRGBClone(child as HTMLElement);
            clone.appendChild(childClone);
          }
        });
        
        return clone;
      };
      
      const cleanClone = createRGBClone(target as HTMLElement);
      tempContainer.appendChild(cleanClone);
      
      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Temporarily remove all stylesheets from document to prevent html2canvas from parsing lab/oklab colors
      const originalStylesheets: HTMLLinkElement[] = [];
      const allStylesheets = Array.from(document.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];
      allStylesheets.forEach((link) => {
        originalStylesheets.push(link);
        // Store parent and next sibling for restoration
        link.setAttribute("data-pdf-temp-parent", link.parentNode?.nodeName || "");
        link.setAttribute("data-pdf-temp-next", link.nextSibling?.nodeName || "");
        // Remove from DOM temporarily
        link.remove();
      });

      // Also remove style tags temporarily
      const originalStyleTags: HTMLStyleElement[] = [];
      const allStyleTags = Array.from(document.querySelectorAll("style")) as HTMLStyleElement[];
      allStyleTags.forEach((style) => {
        originalStyleTags.push(style);
        style.remove();
      });

      try {
        // Use html2canvas on the clean container (no stylesheets in document now)
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          allowTaint: false,
          onclone: (clonedDoc) => {
            // Remove ALL link tags (external stylesheets) from cloned document head
            const head = clonedDoc.head;
            if (head) {
              const linkTags = head.querySelectorAll("link[rel='stylesheet']");
              linkTags.forEach((link) => link.remove());
              
              // Remove ALL style tags from cloned document head to prevent lab/oklab parsing
              const styleTags = head.querySelectorAll("style");
              styleTags.forEach((style) => style.remove());
            }
            
            // Remove ALL style tags from body as well
            const bodyStyleTags = clonedDoc.body?.querySelectorAll("style");
            bodyStyleTags?.forEach((style) => style.remove());
            
            // Remove CSS classes but KEEP inline styles (those contain our RGB colors)
            const allElements = clonedDoc.querySelectorAll("*");
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.removeAttribute("class");
              // DO NOT remove style attribute - it contains our RGB inline styles!
            });
          },
        });

        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error("Failed to capture content. Canvas is empty.");
        }

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Convert pixels to mm (assuming 96 DPI)
        const pxToMm = 0.264583;
        const imgWidthMm = imgWidth * pxToMm;
        const imgHeightMm = imgHeight * pxToMm;
        
        // Calculate scaling to fit page
        const widthRatio = (pdfWidth - 40) / imgWidthMm; // 40mm margins
        const heightRatio = (pdfHeight - 60) / imgHeightMm; // 60mm for header/footer
        const ratio = Math.min(widthRatio, heightRatio, 1); // Don't scale up
        
        let imgScaledWidth = imgWidthMm * ratio;
        let imgScaledHeight = imgHeightMm * ratio;
        let xOffset = (pdfWidth - imgScaledWidth) / 2;
        const yOffset = 0;

        // Add header
        pdf.setFontSize(20);
        pdf.setTextColor(12, 59, 46); // #0C3B2E
        pdf.setFont("helvetica", "bold");
        pdf.text("SolarMatch", pdfWidth / 2, 15, { align: "center" });
        
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          translations.results.title,
          pdfWidth / 2,
          22,
          { align: "center" }
        );

        // Add date
        const date = new Date().toLocaleDateString();
        pdf.setFontSize(10);
        pdf.text(`Generated: ${date}`, pdfWidth / 2, 28, { align: "center" });

        // Add content - scale to fit on one page if possible
        const maxContentHeight = pdfHeight - 50; // Leave space for header and footer
        
        // Scale down if content is too tall
        if (imgScaledHeight > maxContentHeight) {
          const scale = maxContentHeight / imgScaledHeight;
          imgScaledHeight = maxContentHeight;
          imgScaledWidth = imgScaledWidth * scale;
          xOffset = (pdfWidth - imgScaledWidth) / 2;
        }

        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          yOffset + 35,
          imgScaledWidth,
          imgScaledHeight
        );

        // Add footer to last page
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          "SolarMatch - Your Solar Planning Partner",
          pdfWidth / 2,
          pdfHeight - 10,
          { align: "center" }
        );

        pdf.save(`SolarMatch-plan-${date.replace(/\//g, "-")}.pdf`);
        
        console.log("PDF generated successfully");
      } finally {
        // Restore all stylesheets to their original positions
        originalStylesheets.forEach((link) => {
          const parent = document.head || document.body;
          parent.appendChild(link);
          link.removeAttribute("data-pdf-temp-parent");
          link.removeAttribute("data-pdf-temp-next");
        });
        
        // Restore all style tags
        originalStyleTags.forEach((style) => {
          const parent = document.head || document.body;
          parent.appendChild(style);
        });
        
        // Cleanup temporary container
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to generate PDF: ${errorMessage}. Please check the console for details.`);
      
      // Restore stylesheets on error
      originalStylesheets.forEach((link) => {
        if (!document.head.contains(link) && !document.body.contains(link)) {
          const parent = document.head || document.body;
          parent.appendChild(link);
        }
        link.removeAttribute("data-pdf-temp-parent");
        link.removeAttribute("data-pdf-temp-next");
      });
      
      // Restore style tags on error
      originalStyleTags.forEach((style) => {
        if (!document.head.contains(style) && !document.body.contains(style)) {
          const parent = document.head || document.body;
          parent.appendChild(style);
        }
      });
      
      // Cleanup on error
      const tempContainers = document.querySelectorAll("div[style*='-9999px']");
      tempContainers.forEach((container) => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      <Download className="h-4 w-4" />
      {isExporting ? translations.results.generatingPdf : translations.results.downloadPdf}
    </button>
  );
};
