// Swipe-enabled Complete/Delete (Smooth Drag)
document.querySelectorAll('.task').forEach(task => {
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    const completeClass = 'completed';
    const threshold = 100; // pixels to trigger action

    const taskContent = task.querySelector('.task-content');

    // Touch / Mouse Start
    const startDrag = (e) => {
        dragging = true;
        task.classList.add('dragging');
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    };

    // Touch / Mouse Move
    const moveDrag = (e) => {
        if (!dragging) return;
        currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let dx = currentX - startX;
        task.style.transform = `translateX(${dx}px)`;
    };

    // Touch / Mouse End
    const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        task.classList.remove('dragging');
        let dx = currentX - startX;

        if (dx > threshold) {
            // Swipe Right → Complete
            fetch(`/complete/${task.getAttribute('data-id')}`, { method: "POST" })
                .then(() => {
                    task.classList.add(completeClass);
                    task.style.transform = 'translateX(0)';
                });
        } else if (dx < -threshold) {
            // Swipe Left → Delete
            fetch(`/delete/${task.getAttribute('data-id')}`, { method: "POST" })
                .then(() => {
                    task.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                    task.style.transform = 'translateX(-100%)';
                    task.style.opacity = '0';
                    setTimeout(() => task.remove(), 300);
                });
        } else {
            // Snap back if below threshold
            task.style.transition = "transform 0.3s ease";
            task.style.transform = 'translateX(0)';
        }
    };

    // Events
    task.addEventListener('touchstart', startDrag);
    task.addEventListener('touchmove', moveDrag);
    task.addEventListener('touchend', endDrag);

    task.addEventListener('mousedown', startDrag);
    task.addEventListener('mousemove', moveDrag);
    task.addEventListener('mouseup', endDrag);
    task.addEventListener('mouseleave', endDrag);
});
