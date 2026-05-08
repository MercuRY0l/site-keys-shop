


export function animateCartMainPage() {
    const track = document.querySelector('.catalog-track');
    if (!track) return;

    const cards = Array.from(track.children);

    
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}
