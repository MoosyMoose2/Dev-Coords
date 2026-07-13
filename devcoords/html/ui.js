const panel = document.getElementById("panel");
const vec2 = document.getElementById("vec2");
const vec3 = document.getElementById("vec3");
const vec4 = document.getElementById("vec4");
const closeBtn = document.getElementById("closeBtn");

window.addEventListener("message", (event) => {
    const data = event.data;

    if (data.action === "open") {
        panel.classList.remove("hidden");
    } else if (data.action === "close") {
        panel.classList.add("hidden");
    } else if (data.action === "update") {
        vec2.value = data.vector2;
        vec3.value = data.vector3;
        vec4.value = data.vector4;
    }
});

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove("copied");
        }, 900);
    }).catch(() => {
        // Fallback for older CEF builds without clipboard-write permission
        const input = document.getElementById(btn.dataset.target);
        input.select();
        document.execCommand("copy");
    });
}

document.querySelectorAll(".copyBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        copyToClipboard(input.value, btn);
    });
});

closeBtn.addEventListener("click", () => {
    fetch(`https://${GetParentResourceName()}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
});

// --- Drag to move ---
const header = document.querySelector(".header");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (e) => {
    if (e.target === closeBtn) return; // don't drag when clicking the X
    isDragging = true;

    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Switch from top/left % to fixed px so dragging feels 1:1 with the mouse
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;

    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});
