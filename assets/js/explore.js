document.addEventListener('DOMContentLoaded', function () {
  const categoryLinks = document.querySelectorAll('.category-link');
  const tagGroups = document.querySelectorAll('.tag-group');

  function filterTags(category) {
    tagGroups.forEach(group => {
      if (group.id === category) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }
    });
  }

  // Initially, show the first category's tags
  if (tagGroups.length > 0) {
    filterTags(tagGroups[0].id);
  }

  categoryLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const category = this.getAttribute('href').substring(1);
      filterTags(category);

      // Add active class to the clicked link
      categoryLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
