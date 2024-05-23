export function onClick(event) {
  event.stopPropagation();
  const rect = event.currentTarget.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const circle = document.createElement("div");
  circle.className = "circle-button-clicked";

  circle.style.left = `${x - 10}px`;
  circle.style.top = `${y - 10}px`;

  circle.addEventListener("animationend", () => {
    circle.remove();
  });

  event.currentTarget.appendChild(circle);
}
