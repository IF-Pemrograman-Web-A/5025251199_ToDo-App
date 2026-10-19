<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<aside class="sidebar-section" aria-label="Menu Navigasi">
    <div class="section-card">
        <h2 class="section-title">Navigation Menu</h2>
        <nav class="nav-menu">
            <a href="index.php" class="nav-link <?php echo ($current_page == 'index.php') ? 'active' : ''; ?>">
                📌 Personal
            </a>
            <a href="shared.php" class="nav-link <?php echo ($current_page == 'shared.php') ? 'active' : ''; ?>">
                👥 Shared
            </a>
        </nav>
    </div>
</aside>