// admin.js - Dashboard Management System
class AdminDashboard {
    constructor() {
        this.registrations = [];
        this.currentUser = null;
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.checkSession();
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
    }
    
    checkSession() {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            this.redirectToLogin();
            return;
        }
        
        try {
            const sessionData = JSON.parse(session);
            const currentTime = new Date().getTime();
            
            // Check session timeout (24 hours)
            if (currentTime - sessionData.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('adminSession');
                this.redirectToLogin();
                return;
            }
            
            this.currentUser = sessionData.user;
            this.updateUserDisplay();
            
        } catch (error) {
            console.error('Session error:', error);
            this.redirectToLogin();
        }
    }
    
    redirectToLogin() {
        alert('Sesi telah berakhir. Silakan login kembali.');
        window.location.href = 'admin_login.html';
    }
    
    updateUserDisplay() {
        const userElement = document.getElementById('loggedInUser');
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser;
        }
    }
    
    loadData() {
        const storedData = localStorage.getItem('funrunRegistrations');
        this.registrations = storedData ? JSON.parse(storedData) : [];
        
        // If no data, create sample data for demo
        if (this.registrations.length === 0) {
            this.createSampleData();
        }
        
        // Sort by registration date (newest first)
        this.registrations.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    }
    
    createSampleData() {
        const sampleData = [
            {
                id: 1705514400000,
                name: "Andi Pratama",
                email: "andi@example.com",
                phone: "081234567890",
                gender: "male",
                birthDate: "1990-01-15",
                shirtSize: "L",
                emergencyContact: "Ibu (081234567891)",
                healthInfo: "Tidak ada",
                package: "Fun Run 10K",
                amount: 250000,
                registrationDate: "2024-01-17T10:30:00.000Z",
                paymentStatus: "paid"
            },
            {
                id: 1705507200000,
                name: "Sari Dewi",
                email: "sari@example.com",
                phone: "081234567891",
                gender: "female",
                birthDate: "1992-05-20",
                shirtSize: "M",
                emergencyContact: "Ayah (081234567892)",
                healthInfo: "Alergi kacang",
                package: "Fun Run 10K",
                amount: 250000,
                registrationDate: "2024-01-16T14:20:00.000Z",
                paymentStatus: "pending"
            },
            {
                id: 1705420800000,
                name: "Budi Santoso",
                email: "budi@example.com",
                phone: "081234567892",
                gender: "male",
                birthDate: "1988-11-10",
                shirtSize: "XL",
                emergencyContact: "Istri (081234567893)",
                healthInfo: "",
                package: "Fun Run 10K",
                amount: 275000,
                registrationDate: "2024-01-15T09:15:00.000Z",
                paymentStatus: "paid"
            },
            {
                id: 1705334400000,
                name: "Citra Lestari",
                email: "citra@example.com",
                phone: "081234567893",
                gender: "female",
                birthDate: "1995-03-25",
                shirtSize: "XXL",
                emergencyContact: "Suami (081234567894)",
                healthInfo: "Tekanan darah rendah",
                package: "Fun Run 10K",
                amount: 275000,
                registrationDate: "2024-01-14T16:45:00.000Z",
                paymentStatus: "cancelled"
            },
            {
                id: 1705248000000,
                name: "Dian Nugroho",
                email: "dian@example.com",
                phone: "081234567894",
                gender: "male",
                birthDate: "1993-08-30",
                shirtSize: "M",
                emergencyContact: "Kakak (081234567895)",
                healthInfo: "",
                package: "Fun Run 10K",
                amount: 250000,
                registrationDate: "2024-01-13T11:20:00.000Z",
                paymentStatus: "paid"
            }
        ];
        
        this.registrations = sampleData;
        localStorage.setItem('funrunRegistrations', JSON.stringify(sampleData));
        localStorage.setItem('totalParticipants', sampleData.length.toString());
    }
    
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchRegistrations(e.target.value));
        }
        
        // Export button
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        // Time filter
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.filterByTime(e.target.value);
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('adminSession');
            window.location.href = 'admin_login.html';
        }
    }
    
    renderDashboard() {
        this.updateStats();
        this.renderRegistrationsTable();
        this.renderLeaderboard();
        this.updateChartData();
    }
    
    updateStats() {
        const total = this.registrations.length;
        const paid = this.registrations.filter(r => r.paymentStatus === 'paid').length;
        const pending = this.registrations.filter(r => r.paymentStatus === 'pending').length;
        const cancelled = this.registrations.filter(r => r.paymentStatus === 'cancelled').length;
        
        const totalRevenue = this.registrations
            .filter(r => r.paymentStatus === 'paid')
            .reduce((sum, reg) => sum + reg.amount, 0);
        
        // Update stats cards
        document.querySelector('.stat-card:nth-child(1) h3').textContent = total.toLocaleString('id-ID');
        document.querySelector('.stat-card:nth-child(2) h3').textContent = `Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`;
        document.querySelector('.stat-card:nth-child(3) h3').textContent = paid.toLocaleString('id-ID');
        document.querySelector('.stat-card:nth-child(4) h3').textContent = pending.toLocaleString('id-ID');
        
        // Update trends
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekRegistrations = this.registrations.filter(r => 
            new Date(r.registrationDate) > lastWeek
        ).length;
        
        const trend = total > lastWeekRegistrations ? 'up' : 'down';
        const trendElement = document.querySelector('.stat-trend');
        if (trendElement) {
            trendElement.innerHTML = trend === 'up' 
                ? '<i class="fas fa-arrow-up"></i> 12% dari minggu lalu'
                : '<i class="fas fa-arrow-down"></i> 5% dari minggu lalu';
            trendElement.className = `stat-trend trend-${trend}`;
        }
    }
    
    renderRegistrationsTable() {
        const tableBody = document.querySelector('#registrationsTable tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Apply current filter
        let filteredData = this.registrations;
        if (this.currentFilter !== 'all') {
            filteredData = this.registrations.filter(r => r.paymentStatus === this.currentFilter);
        }
        
        // Limit to 10 most recent
        const displayData = filteredData.slice(0, 10);
        
        if (displayData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        <i class="fas fa-inbox"></i>
                        <p>Tidak ada data pendaftaran</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        displayData.forEach(reg => {
            const row = document.createElement('tr');
            
            // Format date
            const regDate = new Date(reg.registrationDate);
            const formattedDate = regDate.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Status badge
            let statusClass = '';
            let statusText = '';
            
            switch(reg.paymentStatus) {
                case 'paid':
                    statusClass = 'status-paid';
                    statusText = 'Lunas';
                    break;
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pending';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Dibatalkan';
                    break;
            }
            
            row.innerHTML = `
                <td>#FR${String(reg.id).slice(-6)}</td>
                <td>
                    <strong>${reg.name}</strong><br>
                    <small>${reg.email}</small>
                </td>
                <td>${reg.shirtSize}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>Rp ${reg.amount.toLocaleString('id-ID')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" data-id="${reg.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn btn-edit" data-id="${reg.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" data-id="${reg.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Attach event listeners to action buttons
        this.attachTableActions();
    }
    
    attachTableActions() {
        // View buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.viewRegistration(id);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.editRegistration(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.deleteRegistration(id);
            });
        });
    }
    
    viewRegistration(id) {
        const registration = this.registrations.find(r => r.id == id);
        if (!registration) return;
        
        const modalContent = `
            <div class="modal-header">
                <h3>Detail Pendaftaran</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="registration-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <p><strong>ID Registrasi:</strong></p>
                        <p>#FR${String(registration.id).slice(-6)}</p>
                    </div>
                    <div>
                        <p><strong>Status:</strong></p>
                        <span class="status-badge ${registration.paymentStatus === 'paid' ? 'status-paid' : 
                            registration.paymentStatus === 'pending' ? 'status-pending' : 'status-cancelled'}">
                            ${registration.paymentStatus === 'paid' ? 'Lunas' : 
                             registration.paymentStatus === 'pending' ? 'Pending' : 'Dibatalkan'}
                        </span>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 15px; color: var(--primary);">Data Peserta</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <p><strong>Nama Lengkap:</strong></p>
                        <p>${registration.name}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong></p>
                        <p>${registration.email}</p>
                    </div>
                    <div>
                        <p><strong>No. Telepon:</strong></p>
                        <p>${registration.phone}</p>
                    </div>
                    <div>
                        <p><strong>Jenis Kelamin:</strong></p>
                        <p>${registration.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                    <div>
                        <p><strong>Tanggal Lahir:</strong></p>
                        <p>${new Date(registration.birthDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                        <p><strong>Ukuran Kaos:</strong></p>
                        <p>${registration.shirtSize}</p>
                    </div>
                </div>
                
                <h4 style="margin: 20px 0 15px; color: var(--primary);">Informasi Tambahan</h4>
                <div>
                    <p><strong>Kontak Darurat:</strong></p>
                    <p>${registration.emergencyContact}</p>
                </div>
                <div style="margin-top: 10px;">
                    <p><strong>Informasi Kesehatan:</strong></p>
                    <p>${registration.healthInfo || 'Tidak ada'}</p>
                </div>
                
                <h4 style="margin: 20px 0 15px; color: var(--primary);">Detail Pembayaran</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <p><strong>Paket:</strong></p>
                        <p>${registration.package}</p>
                    </div>
                    <div>
                        <p><strong>Total Biaya:</strong></p>
                        <p>Rp ${registration.amount.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                        <p><strong>Tanggal Daftar:</strong></p>
                        <p>${new Date(registration.registrationDate).toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                        <p><strong>Status Pembayaran:</strong></p>
                        <p>${registration.paymentStatus === 'paid' ? 'Lunas' : 
                           registration.paymentStatus === 'pending' ? 'Menunggu' : 'Dibatalkan'}</p>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }
    
    editRegistration(id) {
        const registration = this.registrations.find(r => r.id == id);
        if (!registration) return;
        
        const modalContent = `
            <div class="modal-header">
                <h3>Edit Status Pembayaran</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="edit-form">
                <p style="margin-bottom: 20px;"><strong>Peserta:</strong> ${registration.name}</p>
                <p style="margin-bottom: 20px;"><strong>ID:</strong> #FR${String(registration.id).slice(-6)}</p>
                
                <div style="margin-bottom: 25px;">
                    <label for="editPaymentStatus" style="display: block; margin-bottom: 8px; font-weight: 600;">Status Pembayaran:</label>
                    <select id="editPaymentStatus" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;">
                        <option value="pending" ${registration.paymentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="paid" ${registration.paymentStatus === 'paid' ? 'selected' : ''}>Lunas</option>
                        <option value="cancelled" ${registration.paymentStatus === 'cancelled' ? 'selected' : ''}>Dibatalkan</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 25px;">
                    <button id="cancelEdit" style="flex: 1; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Batal
                    </button>
                    <button id="saveEdit" data-id="${registration.id}" style="flex: 1; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
        
        // Add event listeners for modal buttons
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('saveEdit').addEventListener('click', () => {
            const newStatus = document.getElementById('editPaymentStatus').value;
            this.updatePaymentStatus(id, newStatus);
            this.closeModal();
        });
    }
    
    updatePaymentStatus(id, status) {
        const index = this.registrations.findIndex(r => r.id == id);
        if (index !== -1) {
            this.registrations[index].paymentStatus = status;
            localStorage.setItem('funrunRegistrations', JSON.stringify(this.registrations));
            this.renderDashboard();
            
            // Show success message
            this.showAlert(`Status pembayaran untuk ${this.registrations[index].name} telah diubah menjadi: ${status === 'paid' ? 'Lunas' : 
                                                                                                          status === 'pending' ? 'Pending' : 'Dibatalkan'}`, 'success');
        }
    }
    
    deleteRegistration(id) {
        const registration = this.registrations.find(r => r.id == id);
        if (!registration) return;
        
        if (confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${registration.name}?`)) {
            this.registrations = this.registrations.filter(r => r.id != id);
            localStorage.setItem('funrunRegistrations', JSON.stringify(this.registrations));
            
            // Update total participants counter
            let totalParticipants = parseInt(localStorage.getItem('totalParticipants') || '0');
            if (totalParticipants > 0) totalParticipants--;
            localStorage.setItem('totalParticipants', totalParticipants.toString());
            
            this.renderDashboard();
            
            // Show success message
            this.showAlert(`Data ${registration.name} berhasil dihapus!`, 'success');
        }
    }
    
    searchRegistrations(query) {
        if (!query.trim()) {
            this.renderRegistrationsTable();
            return;
        }
        
        const filtered = this.registrations.filter(reg => 
            reg.name.toLowerCase().includes(query.toLowerCase()) ||
            reg.email.toLowerCase().includes(query.toLowerCase()) ||
            reg.phone.includes(query) ||
            `#FR${String(reg.id).slice(-6)}`.includes(query)
        );
        
        this.renderFilteredTable(filtered);
    }
    
    renderFilteredTable(data) {
        const tableBody = document.querySelector('#registrationsTable tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        <i class="fas fa-search"></i>
                        <p>Tidak ada hasil yang cocok</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        data.forEach(reg => {
            const row = document.createElement('tr');
            const regDate = new Date(reg.registrationDate);
            const formattedDate = regDate.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let statusClass = '';
            let statusText = '';
            
            switch(reg.paymentStatus) {
                case 'paid':
                    statusClass = 'status-paid';
                    statusText = 'Lunas';
                    break;
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pending';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Dibatalkan';
                    break;
            }
            
            row.innerHTML = `
                <td>#FR${String(reg.id).slice(-6)}</td>
                <td>
                    <strong>${reg.name}</strong><br>
                    <small>${reg.email}</small>
                </td>
                <td>${reg.shirtSize}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>Rp ${reg.amount.toLocaleString('id-ID')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" data-id="${reg.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn btn-edit" data-id="${reg.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" data-id="${reg.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        this.attachTableActions();
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.renderRegistrationsTable();
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }
    
    filterByTime(timeRange) {
        const now = new Date();
        let filteredData = [];
        
        switch(timeRange) {
            case 'today':
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                filteredData = this.registrations.filter(r => new Date(r.registrationDate) >= today);
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredData = this.registrations.filter(r => new Date(r.registrationDate) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                filteredData = this.registrations.filter(r => new Date(r.registrationDate) >= monthAgo);
                break;
            default:
                filteredData = this.registrations;
        }
        
        this.renderFilteredTable(filteredData);
    }
    
    renderLeaderboard() {
        const leaderboardContainer = document.querySelector('.leaderboard-list');
        if (!leaderboardContainer) return;
        
        // Get top 5 by amount
        const topParticipants = [...this.registrations]
            .filter(r => r.paymentStatus === 'paid')
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
        
        if (topParticipants.length === 0) {
            leaderboardContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-trophy"></i>
                    <p>Belum ada data peserta</p>
                </div>
            `;
            return;
        }
        
        leaderboardContainer.innerHTML = '';
        
        topParticipants.forEach((reg, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            // Get initials for avatar
            const initials = reg.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            
            item.innerHTML = `
                <div class="rank rank-${index + 1}">${index + 1}</div>
                <div class="participant-avatar">${initials}</div>
                <div class="participant-info">
                    <h4>${reg.name}</h4>
                    <p>${reg.shirtSize} • ${new Date(reg.registrationDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div class="participant-amount">Rp ${reg.amount.toLocaleString('id-ID')}</div>
            `;
            
            leaderboardContainer.appendChild(item);
        });
    }
    
    updateChartData() {
        // This would normally connect to a charting library
        // For now, just show placeholder
        const chartPlaceholder = document.querySelector('.chart-placeholder');
        if (chartPlaceholder) {
            // Calculate registration by day for the last 7 days
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                last7Days.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
            }
            
            chartPlaceholder.innerHTML = `
                <i class="fas fa-chart-line"></i>
                <p>Grafik Pendaftaran 7 Hari Terakhir</p>
                <small style="margin-top: 10px; color: #95a5a6;">
                    ${last7Days.join(' • ')}
                </small>
            `;
        }
    }
    
    exportData() {
        const data = {
            exportDate: new Date().toISOString(),
            totalRegistrations: this.registrations.length,
            registrations: this.registrations
        };
        
        const ws = XLSX.utils.json_to_sheet(data.registrations);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Registrations");

        const filename = `funrun-registrations-${new Date().toISOString().slice(0,10)}.xlsx`;

        XLSX.writeFile(wb, filename);
        
        // Show success message
        this.showAlert('Data berhasil diekspor!', 'success');
    }
    
    refreshData() {
        this.loadData();
        this.renderDashboard();
        this.showAlert('Data berhasil diperbarui!', 'success');
    }
    
    showModal(content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('adminModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                ${content}
            </div>
        `;
        
        modal.style.display = 'flex';
        
        // Add close functionality
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    closeModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    showAlert(message, type = 'success') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Insert after header
        const header = document.querySelector('.top-header');
        if (header) {
            header.parentNode.insertBefore(alert, header.nextSibling);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the admin page
    if (window.location.pathname.includes('admin.html')) {
        window.adminDashboard = new AdminDashboard();
        
        // Add mobile menu toggle
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(mobileMenuToggle);
        
        mobileMenuToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            if (window.adminDashboard) {
                window.adminDashboard.refreshData();
            }
        }, 30000);
    }
});