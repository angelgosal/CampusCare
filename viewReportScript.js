<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CampusCare - Home</title>
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="homepagestyle.css">
</head>
<body>

    <div class="app-viewport">
        
        <!-- TOP: FIXED -->
        <div class="fixed-header">
            <header class="logo-container">
                <img src="logo.png" alt="Logo" class="main-logo" onclick="location.href='aboutus.html'">
            </header>

            <div class="search-area">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search" onkeyup="globalSearch()">
                    <i class="fa fa-search"></i>
                </div>
            </div>

            <div class="action-btns">
                <div class="sort-wrapper">
                    <button class="btn-action" onclick="toggleSort()">
                        Sort <i class="fa fa-chevron-down"></i>
                    </button>
                    <div class="sort-dropdown" id="sortMenu">
                        <div class="sort-item" onclick="globalSort('latest')">Latest</div>
                        <div class="sort-item" onclick="globalSort('recent')">Recent</div>
                        <div class="sort-item" onclick="globalSort('19th')">19th Floor</div>
                        <div class="sort-item" onclick="globalSort('7th')">7th Floor</div>
                        <div class="sort-item" onclick="globalSort('6th')">6th Floor</div>
                        <div class="sort-item" onclick="globalSort('LG')">LG Floor</div>
                    </div>
                </div>
                <button class="btn-action" onclick="location.href='addreport.html'">
                    <i class="fa fa-plus"></i> Report
                </button>
            </div>
        </div>

        <!-- MIDDLE: SCROLLABLE -->
        <div class="scroll-content">
<div class="fixed-facility-section">

    <div class="section-header-row">
        <div class="section-title">Fixed Facilities</div>
        <a href="viewreport.html" class="view-all">View All</a>
    </div>

    <div id="fixedContainer" class="cards-container">

        <div class="fixed-card-content searchable-card"
             data-date="2026-05-08"
             data-floor="7th">

            <div class="image-overlay-wrapper">

                <img src="p1.jpeg" class="fixed-photo">

                <div class="status-overlay">
                    <span class="status-pill">7th - SL</span>
                    <span class="status-pill">Desk</span>
                    <span class="status-pill">Fixed</span>
                </div>

            </div>
        </div>

    </div>

    <button class="nav-arrow prev"
            onclick="scrollSection('fixedContainer', -1)">‹</button>

    <button class="nav-arrow next"
            onclick="scrollSection('fixedContainer', 1)">›</button>

</div>

            <div class="progress-section">
                <div class="section-header-row">
                    <div class="section-title">Reported / In-Progress</div>
                    <a href="viewreport.html" class="view-allR">View All</a>
                </div>
                <div class="cards-container" id="issuedContainer">
                    <div class="report-card searchable-card" data-date="2026-02-15" data-floor="6th">
                        <div class="date-box">2026/02/15</div>
                        <div class="img-box"><img src="p5.jpeg"><span class="report-status">Reported</span></div>
                        <div class="info-box">(6th-Library), (Desk)</div>
                    </div>
                    <div class="report-card searchable-card" data-date="2026-02-01" data-floor="7th">
                        <div class="date-box">2026/02/01</div>
                        <div class="img-box"><img src="p4.jpeg"><span class="report-status">In-Progress</span></div>
                        <div class="info-box">(7th-SL), (Chair)</div>
                    </div>
                </div>
                <button class="nav-arrow progress-prev" onclick="scrollSection('issuedContainer', -1)">‹</button>
                <button class="nav-arrow progress-next" onclick="scrollSection('issuedContainer', 1)">›</button>
            </div>
        </div>

        <!-- BOTTOM: FIXED -->
        <nav class="bottom-nav">
            <div class="nav-box active" onclick="location.href='homepage.html'">Home</div>
            <div class="nav-box" onclick="location.href='viewreport.html'">View Reports</div>
            <div class="nav-box" onclick="location.href='feedback.html'">Feedback</div>
        </nav>
    </div>

    <script src="homepagescript.js"></script>
</body>
</html>
