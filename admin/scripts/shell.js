// Renders the sidebar nav + topbar user info. Called on every protected page.
function renderAdminShell(activePage) {
  const profile = JSON.parse(localStorage.getItem('ikoct_admin_profile') || '{}');

  const links = [
    { href: 'dashboard.html', label: 'Overview', key: 'dashboard' },
    { href: 'manage.html?resource=events', label: 'Events', key: 'events' },
    { href: 'manage.html?resource=news', label: 'News', key: 'news' },
    { href: 'manage.html?resource=blog', label: 'Blog Posts', key: 'blog' },
    { href: 'manage.html?resource=stories', label: 'Stories', key: 'stories' },
    { href: 'manage.html?resource=programs', label: 'Programs', key: 'programs' },
    { href: 'manage.html?resource=projects', label: 'Projects', key: 'projects' },
    { href: 'manage.html?resource=gallery', label: 'Gallery', key: 'gallery' },
    { href: 'messages.html', label: 'Contact Messages', key: 'messages' },
    { href: 'settings.html', label: 'Site Settings', key: 'settings' },
  ];
  if (profile.role === 'super_admin') {
    links.push({ href: 'admins.html', label: 'Admin Users', key: 'admins' });
  }

  const navHtml = links
    .map(
      (l) =>
        `<li><a href="${l.href}" class="${l.key === activePage ? 'active' : ''}">${l.label}</a></li>`
    )
    .join('');

  document.getElementById('adminSidebar').innerHTML = `
    <h1>IKOCT Admin</h1>
    <ul class="admin-nav">${navHtml}</ul>
    <div style="padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.15); margin-top: 12px;">
      <div style="font-size:0.85rem; opacity:0.9;">${profile.name || ''}</div>
      <div style="font-size:0.75rem; opacity:0.6; margin-bottom:10px;">${profile.role || ''}</div>
      <a href="#" id="logoutLink" style="color:#f0c9ce; font-size:0.85rem;">Log out</a>
    </div>
  `;

  document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    IkoctAPI.clearToken();
    location.href = 'login.html';
  });
}
