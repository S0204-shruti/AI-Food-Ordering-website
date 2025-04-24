// admin.js
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); // Mobile toggle

    // --- Sidebar Toggle Logic ---
    function toggleSidebar() {
        sidebar?.classList.toggle('active');
        adjustMainContentMargin();
    }

    function adjustMainContentMargin() {
        if (!sidebar || !mainContent) return;

        const sidebarActive = sidebar.classList.contains('active');
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // On mobile, main content always takes full width, sidebar overlays
            mainContent.style.marginLeft = '0';
        } else {
            // On desktop/tablet
            const collapsedWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-collapsed-width').trim() || '80px';
            const expandedWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width').trim() || '280px';
            mainContent.style.marginLeft = sidebarActive ? expandedWidth : collapsedWidth;
        }
    }

     // Desktop toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    // Mobile toggle
    if (mobileMenuToggle) {
         mobileMenuToggle.addEventListener('click', toggleSidebar);
    }

     // Initial setup and resize listener
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;

        if (isMobile) {
            // Ensure sidebar is closed on mobile load/resize unless explicitly opened
            if (sidebar?.classList.contains('active')) {
                // Optional: close it, or let it stay open if user opened it
                 // sidebar.classList.remove('active');
            }
        } else if (isTablet) {
            // Collapse sidebar on tablet view
            sidebar?.classList.remove('active');
        } else {
            // Ensure sidebar is open on larger screens
            sidebar?.classList.add('active');
        }
        adjustMainContentMargin(); // Adjust margin based on current state/width
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load


    // --- Navigation ---
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        if (link.id === 'logout-btn') return; // Skip logout

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href')?.substring(1);
            if (!targetId) return;

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show target section, hide others
            let sectionFound = false;
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                    sectionFound = true;
                    // Load data for the section when it becomes active
                    loadSectionData(targetId);
                } else {
                    section.classList.remove('active');
                }
            });

            if (!sectionFound) {
                 console.warn(`Section with ID #${targetId} not found.`);
                 // Optionally show dashboard as fallback
                 document.getElementById('dashboard')?.classList.add('active');
                 navLinks.forEach(l => l.classList.remove('active'));
                 document.querySelector('.sidebar-nav a[href="#dashboard"]')?.classList.add('active');
            }


            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768 && sidebar?.classList.contains('active')) {
                sidebar.classList.remove('active');
                adjustMainContentMargin(); // Ensure margin is correct after closing
            }
        });
    });

    // --- Data Loading for Sections ---
    function loadSectionData(sectionId) {
        console.log(`Navigating to section: ${sectionId}`);
        switch (sectionId) {
            case 'dashboard':
                // Dashboard data like charts might reload here if needed
                // loadDashboardData(); // Example function call
                break;
            case 'menu-management':
                // Already handled by initializeMenuItems -> loadMenuItems
                break;
            case 'promotions':
                loadPromotionsPage();
                break;
            case 'orders':
                loadOrdersPage();
                break;
            case 'delivery':
                loadDeliveryPage();
                break;
            case 'customers':
                loadCustomersPage();
                break;
            case 'reviews':
                loadReviewsPage();
                break;
            case 'notifications':
                loadNotificationsPage();
                break;
            case 'reports':
                loadReportsPage();
                break;
            case 'user-management':
                loadUsersPage();
                break;
            case 'settings':
                loadSettingsPage();
                break;
            // Add cases for other sections if they need specific loading logic
        }
    }

    // --- Sales Chart (Dashboard) ---
    const salesChartCtx = document.getElementById('sales-chart');
    let salesChartInstance = null; // Store chart instance
    if (salesChartCtx) {
        salesChartInstance = new Chart(salesChartCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Revenue', data: [18500, 22000, 19500, 24000, 25500, 27000, 28500, 31000, 32500, 34000, 36500, 38000], borderColor: '#e85a19', backgroundColor: 'rgba(232, 90, 25, 0.1)', tension: 0.4, fill: true, yAxisID: 'yRevenue' },
                    { label: 'Orders', data: [120, 145, 130, 160, 170, 180, 190, 205, 215, 230, 240, 255], borderColor: '#8bc34a', backgroundColor: 'rgba(139, 195, 74, 0.1)', tension: 0.4, fill: true, yAxisID: 'yOrders' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
                scales: {
                     yRevenue: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Revenue (₹)' } }, // Revenue axis
                     yOrders: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: true, color: 'rgba(0, 0, 0, 0.05)' }, title: { display: true, text: 'Orders' } }, // Orders axis (on right)
                     x: { grid: { display: false } }
                 }
            }
        });

        const salesPeriod = document.getElementById('sales-period');
        if (salesPeriod) {
            salesPeriod.addEventListener('change', function() {
                const period = this.value;
                // Simulate data update based on period (as before)
                 if (period === 'weekly') {
                    salesChartInstance.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    salesChartInstance.data.datasets[0].data = [4500, 5200, 4800, 6100, 7200, 8500, 7800];
                    salesChartInstance.data.datasets[1].data = [30, 35, 32, 40, 48, 55, 50];
                 } else if (period === 'monthly') {
                    salesChartInstance.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    salesChartInstance.data.datasets[0].data = [18500, 22000, 19500, 24000, 25500, 27000, 28500, 31000, 32500, 34000, 36500, 38000];
                    salesChartInstance.data.datasets[1].data = [120, 145, 130, 160, 170, 180, 190, 205, 215, 230, 240, 255];
                 } else if (period === 'yearly') {
                    salesChartInstance.data.labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
                    salesChartInstance.data.datasets[0].data = [150000, 220000, 280000, 350000, 420000, 380000];
                    salesChartInstance.data.datasets[1].data = [1000, 1450, 1800, 2200, 2600, 2400];
                 }
                salesChartInstance.update();
            });
        }
    }

    // --- Menu Management (Existing, Adapted) ---
    const addMenuItemBtn = document.getElementById('add-menu-item');
    const menuItemFormModal = document.getElementById('menu-item-form');
    const cancelFormBtn = document.getElementById('cancel-form');
    const menuForm = document.getElementById('menu-form');
    const menuTableBody = document.querySelector('#menu-management .data-table tbody');

    // Default menu items (used if localStorage is empty)
    const defaultMenuItems = [ /* ... (keep default data as before) ... */
          { id: '1', name: 'Sarso ka Saag', description: 'Traditional Punjabi mustard greens...', price: 250, category: 'main', status: 'active', featured: true, vegetarian: true, ingredients: 'Mustard greens...', calories: 350, allergens: 'Dairy', preparationTime: 30, image: 'assets/sarso-ka-saag.jpg' },
          { id: '2', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese cubes...', price: 280, category: 'main', status: 'active', featured: true, vegetarian: true, ingredients: 'Cottage cheese...', calories: 450, allergens: 'Dairy', preparationTime: 25, image: 'assets/paneer-tikka.jpg' },
          { id: '3', name: 'Dessert Platter', description: 'Assortment of traditional sweets...', price: 220, category: 'dessert', status: 'active', featured: true, vegetarian: true, ingredients: 'Milk, sugar...', calories: 550, allergens: 'Dairy, Nuts', preparationTime: 15, image: 'assets/dessert-platter.jpg' }
    ];
    let menuItems = []; // Holds the current menu items

    function initializeMenuItems() {
        const storedItems = localStorage.getItem('sardaarjiMenuItems');
        if (storedItems) { try { menuItems = JSON.parse(storedItems); } catch (e) { console.error(e); menuItems = [...defaultMenuItems]; localStorage.setItem('sardaarjiMenuItems', JSON.stringify(menuItems)); }}
        else { menuItems = [...defaultMenuItems]; localStorage.setItem('sardaarjiMenuItems', JSON.stringify(menuItems)); }
        loadMenuItems();
    }

    function loadMenuItems() {
        if (!menuTableBody) return;
        menuTableBody.innerHTML = '';
        menuItems.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            row.innerHTML = `<td><img src="${item.image || 'assets/placeholder.jpg'}" alt="${item.name}" class="menu-item-thumbnail"></td> <td>${item.name || 'N/A'}</td> <td>${getCategoryName(item.category)}</td> <td>₹${item.price?.toFixed(2) || '0.00'}</td> <td><span class="status-badge ${item.status}">${capitalizeFirstLetter(item.status)}</span></td> <td>${item.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : '-'}</td> <td class="actions-cell"> <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button> <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button> <button class="action-btn toggle-btn" title="${item.status === 'active' ? 'Deactivate' : 'Activate'}"><i class="fas ${item.status === 'active' ? 'fa-eye-slash' : 'fa-eye'}"></i></button> </td>`;
            menuTableBody.appendChild(row);
        });
        filterMenuItems(); // Apply filters after loading
    }

    function getCategoryName(categoryCode) { const cats = {'main':'Main Course','starter':'Starter','dessert':'Dessert','beverage':'Beverage'}; return cats[categoryCode] || categoryCode; }
    function capitalizeFirstLetter(string) { return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''; }

    function saveMenuItem(itemData) {
        const index = menuItems.findIndex(item => item.id === itemData.id);
        if (index !== -1) { menuItems[index] = { ...menuItems[index], ...itemData }; } else { menuItems.push(itemData); }
        localStorage.setItem('sardaarjiMenuItems', JSON.stringify(menuItems));
        updateMainWebsiteData();
    }

    function editMenuItem(itemId) { /* ... (keep existing edit logic) ... */
         const item = menuItems.find(item => item.id === itemId);
         if (!item) { showToast('Item not found.', 'error'); return; }
         // Fill form
         document.getElementById('item-name').value = item.name || '';
         document.getElementById('item-category').value = item.category || 'main';
         document.getElementById('item-price').value = item.price || '';
         document.getElementById('item-status').value = item.status || 'inactive';
         document.getElementById('item-description').value = item.description || '';
         document.getElementById('item-featured').checked = item.featured || false;
         document.getElementById('item-veg').checked = item.vegetarian || false;
         document.getElementById('item-ingredients').value = item.ingredients || '';
         document.getElementById('item-calories').value = item.calories || '';
         document.getElementById('item-allergens').value = item.allergens || '';
         document.getElementById('item-preparation-time').value = item.preparationTime || '';
         // Image preview
         const imagePreview = document.getElementById('image-preview');
         if (item.image) { imagePreview.style.backgroundImage = `url(${item.image})`; imagePreview.innerHTML = ''; }
         else { imagePreview.style.backgroundImage = ''; imagePreview.innerHTML = '<span>No image selected</span>'; }
         // Show modal and set ID
         menuItemFormModal?.classList.remove('hidden');
         menuItemFormModal?.classList.add('show');
         menuForm?.setAttribute('data-item-id', item.id);
    }

    function deleteMenuItem(itemId) { /* ... (keep existing delete logic) ... */
         menuItems = menuItems.filter(item => item.id !== itemId);
         localStorage.setItem('sardaarjiMenuItems', JSON.stringify(menuItems));
         loadMenuItems();
         showToast('Item deleted.', 'success');
         updateMainWebsiteData();
    }

    function toggleItemVisibility(itemId) { /* ... (keep existing toggle logic) ... */
         const index = menuItems.findIndex(item => item.id === itemId);
         if (index === -1) return;
         menuItems[index].status = menuItems[index].status === 'active' ? 'inactive' : 'active';
         localStorage.setItem('sardaarjiMenuItems', JSON.stringify(menuItems));
         loadMenuItems();
         showToast(`Item ${menuItems[index].status === 'active' ? 'activated' : 'deactivated'}.`, 'success');
         updateMainWebsiteData();
    }

    // Menu Item Form Handling (Modal Open/Close, Preview, Submit) - Keep existing logic
    if (addMenuItemBtn) addMenuItemBtn.addEventListener('click', () => { /* ... open modal, reset form ... */
         menuItemFormModal?.classList.remove('hidden');
         menuItemFormModal?.classList.add('show');
         menuForm?.reset();
         const preview = document.getElementById('image-preview');
         if(preview) { preview.style.backgroundImage = ''; preview.innerHTML = '<span>No image selected</span>'; }
         menuForm?.removeAttribute('data-item-id');
         const statusEl = document.getElementById('item-status');
         if (statusEl) statusEl.value = 'active'; // Default to active
    });
    if (cancelFormBtn) cancelFormBtn.addEventListener('click', () => { /* ... close modal ... */
         menuItemFormModal?.classList.remove('show');
         menuItemFormModal?.classList.add('hidden');
    });
     // Image preview logic... (keep existing)
    const itemImageInput = document.getElementById('item-image');
    const imagePreview = document.getElementById('image-preview');
    if (itemImageInput && imagePreview) { /* ... keep existing image preview logic ... */
        itemImageInput.addEventListener('change', function() {
             const file = this.files[0];
             if (file) {
                 const reader = new FileReader();
                 reader.onload = (e) => { imagePreview.style.backgroundImage = `url(${e.target.result})`; imagePreview.innerHTML = ''; };
                 reader.readAsDataURL(file);
             } else {
                 imagePreview.style.backgroundImage = ''; imagePreview.innerHTML = '<span>No image selected</span>';
             }
         });
    }
    // Form submission logic... (keep existing)
     if (menuForm) menuForm.addEventListener('submit', (e) => { /* ... preventDefault, gather data, validate, call saveMenuItem, close modal, show toast, loadMenuItems ... */
         e.preventDefault();
         const itemId = menuForm.dataset.itemId;
         const isEditing = !!itemId;
         const formData = { /* ... gather all form data ... */
             id: isEditing ? itemId : Date.now().toString(),
             name: document.getElementById('item-name').value.trim(),
             category: document.getElementById('item-category').value,
             price: parseFloat(document.getElementById('item-price').value),
             status: document.getElementById('item-status').value,
             description: document.getElementById('item-description').value.trim(),
             featured: document.getElementById('item-featured').checked,
             vegetarian: document.getElementById('item-veg').checked,
             ingredients: document.getElementById('item-ingredients').value.trim(),
             calories: parseInt(document.getElementById('item-calories').value) || null,
             allergens: document.getElementById('item-allergens').value.trim(),
             preparationTime: parseInt(document.getElementById('item-preparation-time').value) || null,
             image: imagePreview.style.backgroundImage ? imagePreview.style.backgroundImage.slice(5, -2) : (isEditing ? menuItems.find(item => item.id === itemId)?.image || '' : '')
         };
         if (!formData.name || isNaN(formData.price) || formData.price < 0) { showToast('Invalid name or price.', 'error'); return; }
         saveMenuItem(formData);
         menuItemFormModal?.classList.remove('show'); menuItemFormModal?.classList.add('hidden');
         showToast(`Item ${isEditing ? 'updated' : 'added'}.`, 'success');
         loadMenuItems();
         menuForm.removeAttribute('data-item-id');
     });

    // Event Delegation for Table Actions (Menu Items)
    if (menuTableBody) menuTableBody.addEventListener('click', (e) => { /* ... keep existing delegation logic for edit, delete, toggle ... */
         const targetButton = e.target.closest('button.action-btn');
         if (!targetButton) return;
         const row = targetButton.closest('tr');
         const itemId = row?.dataset.id;
         if (!itemId) return;
         if (targetButton.classList.contains('edit-btn')) { editMenuItem(itemId); }
         else if (targetButton.classList.contains('delete-btn')) { const name = row.querySelector('td:nth-child(2)')?.textContent || 'item'; showDeleteConfirmation(itemId, name); }
         else if (targetButton.classList.contains('toggle-btn')) { toggleItemVisibility(itemId); }
    });

    // --- Confirmation Modal (Existing) ---
    const confirmationModal = document.getElementById('confirmation-modal');
    const cancelActionBtn = document.getElementById('cancel-action');
    const confirmActionBtn = document.getElementById('confirm-action');
    let currentAction = null;
    // Keep existing confirmation modal logic (showDeleteConfirmation, listeners for cancel/confirm)
    function showDeleteConfirmation(itemId, itemName) { /* ... (keep existing logic) ... */
         const msgEl = document.getElementById('confirmation-message');
         if(msgEl && confirmationModal) {
            msgEl.textContent = `Are you sure you want to delete "${itemName}"? This cannot be undone.`;
            currentAction = () => deleteMenuItem(itemId); // Adjust action as needed
            confirmationModal.classList.remove('hidden');
            confirmationModal.classList.add('show');
         }
    }
    if (cancelActionBtn) cancelActionBtn.addEventListener('click', () => { /* ... close modal, clear action ... */
         confirmationModal?.classList.remove('show'); confirmationModal?.classList.add('hidden'); currentAction = null;
    });
    if (confirmActionBtn) confirmActionBtn.addEventListener('click', () => { /* ... execute action, close modal, clear action ... */
         if(typeof currentAction === 'function') currentAction();
         confirmationModal?.classList.remove('show'); confirmationModal?.classList.add('hidden'); currentAction = null;
    });
     // Add listeners for modal close buttons
     confirmationModal?.querySelectorAll('.close-modal').forEach(btn => {
         btn.addEventListener('click', () => {
             confirmationModal.classList.remove('show');
             confirmationModal.classList.add('hidden');
             currentAction = null;
         });
     });
     // Add listener for overlay click
     confirmationModal?.addEventListener('click', (e) => {
         if (e.target === confirmationModal) {
             confirmationModal.classList.remove('show');
             confirmationModal.classList.add('hidden');
             currentAction = null;
         }
     });


    // --- Promotions Placeholder ---
    function loadPromotionsPage() {
        console.log("Loading Promotions page...");
        const tableBody = document.querySelector('#promotions-table tbody');
        if (tableBody) {
            // In real app, fetch data. Using static HTML data for now.
            // tableBody.innerHTML = '<tr><td colspan="8">Loading promotions...</td></tr>';
        }
        // Add listeners for add/edit/delete buttons if needed
        document.getElementById('add-promotion-btn')?.addEventListener('click', () => {
             showToast('Add Promotion form not implemented yet.', 'info');
        });
    }

    // --- Orders Placeholder ---
    function loadOrdersPage() {
        console.log("Loading Orders page...");
        const tableBody = document.querySelector('#orders-table tbody');
        if (tableBody) {
            // In real app, fetch data. Using static HTML data for now.
            // tableBody.innerHTML = '<tr><td colspan="7">Loading orders...</td></tr>';
            // Add event listeners for view/assign buttons
             tableBody.addEventListener('click', (e) => {
                 if (e.target.closest('.view-btn')) showToast('View order details not implemented yet.', 'info');
                 if (e.target.closest('.assign-btn')) showToast('Assign driver not implemented yet.', 'info');
                 if (e.target.closest('.print-btn')) showToast('Print invoice not implemented yet.', 'info');
             });
        }
    }

    // --- Delivery Management Placeholder ---
    function loadDeliveryPage() {
        console.log("Loading Delivery Management page...");
        const tableBody = document.querySelector('#drivers-table tbody');
        if (tableBody) {
            // In real app, fetch data. Using static HTML data for now.
            // tableBody.innerHTML = '<tr><td colspan="6">Loading delivery staff...</td></tr>';
        }
         // Placeholder map initialization
         const mapEl = document.getElementById('delivery-map-placeholder');
         if (mapEl) {
             // In real app, initialize Leaflet/Mapbox/Google Maps here
             console.log("Initialize delivery map here...");
         }
         // Add listeners for add/edit/view buttons
         document.getElementById('add-driver-btn')?.addEventListener('click', () => {
             showToast('Add Driver form not implemented yet.', 'info');
         });
    }

    // --- Customers Placeholder ---
    function loadCustomersPage() {
        console.log("Loading Customers page...");
        const tableBody = document.querySelector('#customers-table tbody');
        if (tableBody) {
            // In real app, fetch data. Using static HTML data for now.
            // tableBody.innerHTML = '<tr><td colspan="8">Loading customers...</td></tr>';
             // Add event listeners for view/deactivate/activate buttons
             tableBody.addEventListener('click', (e) => {
                 if (e.target.closest('.view-btn')) showToast('View customer details not implemented yet.', 'info');
                 if (e.target.closest('.deactivate-btn')) showToast('Deactivate customer not implemented yet.', 'info');
                 if (e.target.closest('.activate-btn')) showToast('Activate customer not implemented yet.', 'info');
             });
        }
    }

    // --- Reviews Placeholder ---
    function loadReviewsPage() {
        console.log("Loading Reviews page...");
         const reviewListContainer = document.querySelector('#reviews .reviews-management-list');
         if (reviewListContainer) {
             // In real app, fetch reviews. Using static HTML for now.
             // reviewListContainer.innerHTML = '<p>Loading reviews...</p>';
             // Add event listeners for approve/reject/reply buttons
             reviewListContainer.addEventListener('click', (e) => {
                 if (e.target.closest('.approve-btn')) showToast('Approve review not implemented yet.', 'info');
                 if (e.target.closest('.reject-btn')) showToast('Reject review not implemented yet.', 'info');
                 if (e.target.closest('.btn-reply')) showToast('Reply to review not implemented yet.', 'info');
             });
         }
    }

    // --- Notifications Placeholder ---
    function loadNotificationsPage() {
        console.log("Loading Notifications page...");
        const form = document.getElementById('notification-form');
        const targetSelect = document.getElementById('noti-target');
        const specificInputDiv = document.getElementById('specific-customer-input');

        targetSelect?.addEventListener('change', function() {
             if (this.value === 'specific') {
                 specificInputDiv?.classList.remove('hidden');
             } else {
                 specificInputDiv?.classList.add('hidden');
             }
        });

        form?.addEventListener('submit', (e) => {
             e.preventDefault();
             const title = document.getElementById('noti-title').value;
             const message = document.getElementById('noti-message').value;
             if (title && message) {
                 // Simulate sending
                 console.log("Sending notification:", { title, message, target: targetSelect.value });
                 showToast('Notification sent (simulated).', 'success');
                 form.reset();
                 specificInputDiv?.classList.add('hidden');
             } else {
                 showToast('Please enter title and message.', 'warning');
             }
        });
    }

    // --- Reports Placeholder ---
    function loadReportsPage() {
        console.log("Loading Reports page...");
        const generateBtn = document.getElementById('generate-report-btn');
        const exportBtn = document.getElementById('export-report-btn');
        const outputArea = document.getElementById('report-output-area');

        generateBtn?.addEventListener('click', () => {
            const reportType = document.getElementById('report-type')?.value;
            console.log(`Generating report: ${reportType}`);
            // Simulate report generation
            if (outputArea) {
                outputArea.innerHTML = `
                    <div class="card-header"><h3>Report Results: ${capitalizeFirstLetter(reportType?.replace('_', ' ') || '')}</h3></div>
                    <div style="padding: 20px; text-align: center;">
                        Report generated (placeholder). Add chart or table here based on type.
                    </div>`;
            }
             showToast('Report generated (simulated).', 'info');
             // In real app, fetch data and render chart/table
        });
        exportBtn?.addEventListener('click', () => {
             showToast('Export functionality not implemented yet.', 'info');
        });
    }

    // --- User Management Placeholder ---
    function loadUsersPage() {
        console.log("Loading User Management page...");
        const tableBody = document.querySelector('#admin-users-table tbody');
        if (tableBody) {
            // In real app, fetch admin users. Using static HTML for now.
            // tableBody.innerHTML = '<tr><td colspan="6">Loading admin users...</td></tr>';
        }
        document.getElementById('add-admin-user-btn')?.addEventListener('click', () => {
             showToast('Add Admin User form not implemented yet.', 'info');
        });
    }

    // --- Settings Placeholder ---
    function loadSettingsPage() {
        console.log("Loading Settings page...");
        // Add listeners for save buttons on each settings form
         document.getElementById('general-settings-form')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('General settings saved (simulated).', 'success'); });
         document.getElementById('delivery-settings-form')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Delivery settings saved (simulated).', 'success'); });
         document.getElementById('payment-settings-form')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Payment settings saved (simulated).', 'success'); });
    }


    // --- Main Website Data Sync ---
    function updateMainWebsiteData() {
        const activeItems = menuItems.filter(item => item.status === 'active');
        const featuredItems = activeItems.filter(item => item.featured);
        localStorage.setItem('sardaarjiActiveMenuItems', JSON.stringify(activeItems));
        localStorage.setItem('sardaarjiFeaturedMenuItems', JSON.stringify(featuredItems));
        // Dispatch event for potential real-time update on main site
        window.dispatchEvent(new CustomEvent('sardaarjiMenuUpdated'));
        console.log("Main website data updated in localStorage.");
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'info') { /* ... (keep existing toast function) ... */
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`; // Add show immediately
        let icon = 'info-circle';
        if(type === 'success') icon = 'check-circle';
        if(type === 'error') icon = 'exclamation-circle';
        if(type === 'warning') icon = 'exclamation-triangle';
        toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Remove after fade
        }, 3000);
    }

    // --- Menu Item Filtering (Existing) ---
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchFilterInput = document.querySelector('#menu-management .search-filter input');
    if(categoryFilter) categoryFilter.addEventListener('change', filterMenuItems);
    if(statusFilter) statusFilter.addEventListener('change', filterMenuItems);
    if(searchFilterInput) searchFilterInput.addEventListener('input', filterMenuItems);

    function filterMenuItems() { /* ... (keep existing filter logic) ... */
        const catVal = categoryFilter ? categoryFilter.value : 'all';
        const statVal = statusFilter ? statusFilter.value : 'all';
        const term = searchFilterInput ? searchFilterInput.value.toLowerCase().trim() : '';
        const rows = menuTableBody?.querySelectorAll('tr') || [];

        rows.forEach(row => {
             const item = menuItems.find(i => i.id === row.dataset.id);
             if (!item) { row.style.display = 'none'; return; }
             const catMatch = catVal === 'all' || item.category === catVal;
             const statMatch = statVal === 'all' || item.status === statVal;
             const searchMatch = term === '' || item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
             row.style.display = (catMatch && statMatch && searchMatch) ? '' : 'none';
        });
    }

    // --- Dashboard Recent Orders (Simplified Load) ---
    function loadDashboardOrders() {
        const tableBody = document.querySelector('.recent-orders .data-table tbody');
        if (!tableBody) return;
        // Use static data from HTML or simple dummy data
        const dummyOrders = [
             { id: '#ORD-5783', customer: 'Priya S.', total: 750, status: 'delivered', time: '1:45 PM'},
             { id: '#ORD-5782', customer: 'Rahul V.', total: 520, status: 'preparing', time: '1:30 PM'},
             { id: '#ORD-5781', customer: 'Anita P.', total: 980, status: 'pending', time: '1:15 PM'}
        ];
        tableBody.innerHTML = ''; // Clear first
        dummyOrders.forEach(order => {
             const row = document.createElement('tr');
             row.innerHTML = `<td>${order.id}</td><td>${order.customer}</td><td>₹${order.total.toFixed(2)}</td><td><span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span></td><td>${order.time}</td>`;
             tableBody.appendChild(row);
        });
    }

    // --- Logout (Existing) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { /* ... keep existing logout logic ... */
         e.preventDefault();
         showToast('Logging out...', 'info');
         // Simulate clearing auth state
         localStorage.removeItem('adminAuthToken'); // Example
         setTimeout(() => window.location.href = 'login.html', 1500);
    });

    // --- Initialization ---
    function initializeAdminPanel() {
        console.log("Initializing Admin Panel...");
        initializeMenuItems(); // Load and display menu items
        loadDashboardOrders(); // Load recent orders for dashboard

        // Activate the default section (Dashboard)
        document.querySelector('.sidebar-nav a[href="#dashboard"]')?.classList.add('active');
        document.getElementById('dashboard')?.classList.add('active');

        setTimeout(() => showToast('Welcome back!', 'success'), 500);
    }

    initializeAdminPanel(); // Run on load

}); // End DOMContentLoaded
