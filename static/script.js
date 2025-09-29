// Handle Complete and Delete Actions with AJAX
document.querySelectorAll('.task').forEach(task => {
    const taskId = task.getAttribute('data-id');

    // Complete Button
    const completeBtn = task.querySelector('.complete-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            fetch(`/complete/${taskId}`, { method: "POST" })
                .then(response => response.json())
                .then(() => {
                    task.classList.add('completed');
                    completeBtn.remove();
                });
        });
    }

    // Delete Button
    const deleteBtn = task.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        fetch(`/delete/${taskId}`, { method: "POST" })
            .then(response => response.json())
            .then(() => {
                task.style.transition = "opacity 0.3s ease";
                task.style.opacity = "0";
                setTimeout(() => task.remove(), 300);
            });
    });
});
