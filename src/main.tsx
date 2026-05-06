import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const EDITOR_BRIDGE_VERSION = 2;
let EDIT_MODE = false;
let dragState: {
  element: HTMLElement;
  startX: number;
  startY: number;
  initialLeft: number;
  initialTop: number;
  moved: boolean;
} | null = null;

window.addEventListener("message", (event) => {
  if (event.data?.type === "SET_EDIT_MODE") {
    EDIT_MODE = Boolean(event.data.enabled);
    document.body.style.cursor = EDIT_MODE ? "crosshair" : "default";
  }

  if (event.data?.type === "APPLY_EDITOR_OVERRIDES") {
    applyEditorOverrides();
  }
});

function getProjectIdFromPath() {
  const parts = window.location.pathname.split("/");
  return parts.find((part) => part.startsWith("project_")) || "";
}

async function applyEditorOverrides() {
  const projectId = getProjectIdFromPath();
  if (!projectId) return;

  try {
    const response = await fetch(`/projects/${projectId}/editor/overrides?t=${Date.now()}`, {
      cache: "no-store"
    });

    const overrides = await response.json();

    Object.entries(overrides).forEach(([editId, value]) => {
      const element = document.querySelector(`[data-edit-id="${editId}"]`) as HTMLElement | null;
      if (!element) return;

      const item = value as {
        text?: string;
        style?: Record<string, string>;
        attributes?: Record<string, string>;
      };

      if (typeof item.text === "string") {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.value = item.text;
        } else {
          element.innerText = item.text;
        }
      }

      if (item.style) {
        Object.entries(item.style).forEach(([key, val]) => {
          if (!val) return;
          element.style[key as any] = val;
        });
      }

      if (item.attributes) {
        Object.entries(item.attributes).forEach(([key, val]) => {
          if (!val) return;
          if (key === "src" && element instanceof HTMLImageElement) {
            element.src = val;
          } else if (key === "href" && element instanceof HTMLAnchorElement) {
            element.href = val;
          } else {
            element.setAttribute(key, val);
          }
        });
      }
    });
  } catch (error) {
    console.warn("Failed to apply editor overrides", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyEditorOverrides();
  setTimeout(applyEditorOverrides, 100);
  setTimeout(applyEditorOverrides, 500);
  setTimeout(applyEditorOverrides, 1000);
});

window.addEventListener("load", () => {
  applyEditorOverrides();
  setTimeout(applyEditorOverrides, 300);
});

function selectEditableElement(editable: HTMLElement) {
  const styles = window.getComputedStyle(editable);

  window.parent.postMessage(
    {
      type: "ELEMENT_SELECTED",
      editId: editable.dataset.editId,
      text: editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement
        ? editable.value
        : editable.innerText || editable.getAttribute("placeholder") || editable.getAttribute("alt") || "",
      tagName: editable.tagName.toLowerCase(),
      attributes: {
        src: editable instanceof HTMLImageElement ? editable.getAttribute("src") || "" : "",
        href: editable instanceof HTMLAnchorElement ? editable.getAttribute("href") || "" : "",
        alt: editable.getAttribute("alt") || "",
      },
      styles: {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        position: styles.position,
        left: styles.left === "auto" ? "" : styles.left,
        top: styles.top === "auto" ? "" : styles.top,
        width: styles.width,
        height: styles.height,
        objectFit: styles.objectFit,
        backgroundImage: styles.backgroundImage === "none" ? "" : styles.backgroundImage,
      },
    },
    "*"
  );
}

document.addEventListener("pointerdown", (event) => {
  if (!EDIT_MODE) return;

  const target = event.target as HTMLElement;
  const editable = target.closest("[data-edit-id]") as HTMLElement | null;
  if (!editable) return;

  event.preventDefault();
  event.stopPropagation();

  selectEditableElement(editable);

  const computed = window.getComputedStyle(editable);
  const currentLeft = Number.parseFloat(editable.style.left || computed.left);
  const currentTop = Number.parseFloat(editable.style.top || computed.top);
  const left = Number.isFinite(currentLeft) ? currentLeft : 0;
  const top = Number.isFinite(currentTop) ? currentTop : 0;

  if (computed.position === "static") {
    editable.style.position = "relative";
  }

  editable.style.zIndex = "20";

  dragState = {
    element: editable,
    startX: event.clientX,
    startY: event.clientY,
    initialLeft: left,
    initialTop: top,
    moved: false,
  };
});

document.addEventListener("pointermove", (event) => {
  if (!EDIT_MODE || !dragState) return;

  const dx = event.clientX - dragState.startX;
  const dy = event.clientY - dragState.startY;
  if (Math.abs(dx) + Math.abs(dy) > 2) {
    dragState.moved = true;
  }

  dragState.element.style.left = `${Math.round(dragState.initialLeft + dx)}px`;
  dragState.element.style.top = `${Math.round(dragState.initialTop + dy)}px`;
});

document.addEventListener("pointerup", () => {
  if (!EDIT_MODE || !dragState) return;

  if (dragState.moved) {
    const styles = window.getComputedStyle(dragState.element);
    window.parent.postMessage(
      {
        type: "ELEMENT_DRAGGED",
        editId: dragState.element.dataset.editId,
        styles: {
          position: dragState.element.style.position || styles.position,
          left: dragState.element.style.left,
          top: dragState.element.style.top,
          zIndex: dragState.element.style.zIndex || "20",
        },
      },
      "*"
    );
  }

  dragState = null;
});

