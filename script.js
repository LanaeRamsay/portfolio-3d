// Select all items with "svg" class and add the class "hovered" on click or hovering with the mouse (to color it white through css)

const items = document.querySelectorAll(".svg");

items.forEach(item => {

    item.addEventListener("mouseenter", () => {
        item.classList.add("hovered");
    });

        item.addEventListener("touchstart", () => {
        item.classList.add("hovered");
    });

    item.addEventListener("mouseleave", () => {
        item.classList.remove("hovered");
    });

        item.addEventListener("touchend", () => {
        item.classList.remove("hovered");
    });
});
