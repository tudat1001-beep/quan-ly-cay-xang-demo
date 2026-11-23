(() => {
  'use strict';

  const STORAGE_KEY = 'tram-xanh-customer-demo-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  const dateOffset = (date, days) => new Date(Date.parse(date + 'T00:00:00Z') + days * 86400000).toISOString().slice(0, 10);
  const id = () => crypto.randomUUID();
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const money = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + ' ₫';
  const liters = (milli) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(Number(milli || 0) / 1000) + ' L';
  const meterValue = (milli) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(Number(milli || 0) / 1000);

  function seedData() {
    const date = today();
    const data = {
      schema: 2,
      fuels: [
        { id: 'f95', name: 'Xăng RON 95-III', active: true },
        { id: 'e5', name: 'Xăng E5 RON 92', active: true },
        { id: 'diesel', name: 'Dầu DO 0,05S', active: true }
      ],
      pumps: [
        { id: 't1', code: 'T1', fuelId: 'f95', startDate: date, initialReading: 10420000, active: true },
        { id: 't2', code: 'T2', fuelId: 'f95', startDate: date, initialReading: 8310000, active: true },
        { id: 'd1', code: 'D1', fuelId: 'diesel', startDate: date, initialReading: 6400000, active: true }
      ],
      companies: [
        { id: 'c-anphat', name: 'Công ty Vận tải An Phát', active: true },
        { id: 'c-minhlong', name: 'Công ty Minh Long', active: true }
      ],
      vehicles: [
        { id: 'v-1', plate: '51A-123.45', companyId: 'c-anphat', active: true },
        { id: 'v-2', plate: '51D-678.90', companyId: 'c-anphat', active: true },
        { id: 'v-3', plate: '60C-246.80', companyId: 'c-minhlong', active: true }
      ],
      suppliers: [
        { id: 's-petrolimex', name: 'Nhà cung cấp Miền Đông', active: true },
        { id: 's-namviet', name: 'Nhiên liệu Nam Việt', active: true }
      ],
      prices: [
        { id: 'pr-1', fuelId: 'f95', validFrom: date, price: 20500 },
        { id: 'pr-2', fuelId: 'e5', validFrom: date, price: 19800 },
        { id: 'pr-3', fuelId: 'diesel', validFrom: date, price: 19200 }
      ],
      transactions: [],
      closes: []
    };
    const add = (kind, dateValue, values) => data.transactions.push({ id: id(), kind, date: dateValue, createdAt: new Date().toISOString(), ...values });
    add('opening-stock', date, { fuelId: 'f95', stockDelta: 5000000, note: 'Tồn đầu kỳ mẫu' });
    add('opening-stock', date, { fuelId: 'diesel', stockDelta: 3000000, note: 'Tồn đầu kỳ mẫu' });
    add('opening-debt', date, { partyKind: 'company', partyId: 'c-anphat', debtDelta: 2500000, note: 'Công nợ đầu kỳ mẫu' });
    add('opening-debt', date, { partyKind: 'company', partyId: 'c-minhlong', debtDelta: 800000, note: 'Công nợ đầu kỳ mẫu' });
    add('opening-debt', date, { partyKind: 'supplier', partyId: 's-petrolimex', debtDelta: 3000000, note: 'Công nợ đầu kỳ mẫu' });
    add('opening-debt', date, { partyKind: 'supplier', partyId: 's-namviet', debtDelta: 1500000, note: 'Công nợ đầu kỳ mẫu' });
    add('purchase', date, { supplierId: 's-petrolimex', fuelId: 'f95', liters: 1500000, price: 20500, amount: 30750000, stockDelta: 1500000, debtDelta: 30750000, note: 'PN-1001 · dữ liệu mẫu' });
    add('purchase', date, { supplierId: 's-namviet', fuelId: 'diesel', liters: 900000, price: 18000, amount: 16200000, stockDelta: 900000, debtDelta: 16200000, note: 'PN-205 · dữ liệu mẫu' });
    add('pump-fill', date, { pumpId: 't1', fuelId: 'f95', liters: 300000, stockDelta: -300000, pumpStockDelta: 300000, note: 'Nạp trụ T1 · dữ liệu mẫu' });
    add('pump-fill', date, { pumpId: 't2', fuelId: 'f95', liters: 200000, stockDelta: -200000, pumpStockDelta: 200000, note: 'Nạp trụ T2 · dữ liệu mẫu' });
    add('pump-fill', date, { pumpId: 'd1', fuelId: 'diesel', liters: 100000, stockDelta: -100000, pumpStockDelta: 100000, note: 'Nạp trụ D1 · dữ liệu mẫu' });
    add('sale', date, { companyId: 'c-anphat', vehicleId: 'v-1', plate: '51A-123.45', pumpId: 't1', fuelId: 'f95', liters: 90000, price: 20500, amount: 1845000, stockDelta: 0, pumpStockDelta: -90000, debtDelta: 1845000, note: 'Xe tuyến nội thành' });
    add('sale', date, { companyId: 'c-anphat', vehicleId: 'v-2', plate: '51D-678.90', pumpId: 't2', fuelId: 'f95', liters: 45000, price: 20500, amount: 922500, stockDelta: 0, pumpStockDelta: -45000, debtDelta: 922500, note: 'Xe giao hàng' });
    add('sale', date, { companyId: 'c-minhlong', vehicleId: 'v-3', plate: '60C-246.80', pumpId: 'd1', fuelId: 'diesel', liters: 25000, price: 20500, amount: 512500, stockDelta: 0, pumpStockDelta: -25000, debtDelta: 512500, note: 'Xe tải' });
    add('receipt', date, { partyKind: 'company', partyId: 'c-anphat', amount: 1200000, debtDelta: -1200000, note: 'Chuyển khoản · mẫu' });
    add('payment', date, { partyKind: 'supplier', partyId: 's-petrolimex', amount: 8000000, debtDelta: -8000000, note: 'Ủy nhiệm chi · mẫu' });
    return data;
  }

  function loadData() {
    let value;
    try {
      value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {}
    if (value?.schema === 2 && Array.isArray(value.transactions)) return value;
    if (value?.schema === 1 && Array.isArray(value.transactions)) {
      value.closes ||= [];
      const movements = new Map();
      for (const tx of value.transactions) {
        if (!tx.pumpId || !['sale', 'retail', 'reversal'].includes(tx.kind) || !Number(tx.stockDelta)) continue;
        const delta = Number(tx.stockDelta);
        tx.pumpStockDelta = delta;
        tx.stockDelta = 0;
        movements.set(tx.pumpId, (movements.get(tx.pumpId) || 0) + delta);
      }
      for (const [pumpId, delta] of movements) {
        if (!delta) continue;
        const pumpItem = value.pumps?.find((item) => item.id === pumpId);
        value.transactions.push({ id: id(), kind: 'legacy-pump-balance', date: today(), createdAt: new Date().toISOString(), pumpId, fuelId: pumpItem?.fuelId, liters: Math.abs(delta), stockDelta: delta, pumpStockDelta: -delta, note: 'Cân đối lịch sử khi bật theo dõi tồn theo trụ' });
      }
      value.schema = 2;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
      return value;
    }
    const seeded = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  let data = loadData();
  let view = 'home';
  let toastTimer;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      notify('Trình duyệt không cho lưu cục bộ. Hãy bật quyền lưu trang trong trình duyệt.');
      throw new Error('Không thể lưu dữ liệu trong trình duyệt này.');
    }
  }
  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  function fuel(idValue) { return data.fuels.find((item) => item.id === idValue); }
  function pump(idValue) { return data.pumps.find((item) => item.id === idValue); }
  function company(idValue) { return data.companies.find((item) => item.id === idValue); }
  function supplier(idValue) { return data.suppliers.find((item) => item.id === idValue); }
  function currentPrice(fuelId, date = today()) {
    return data.prices.filter((item) => item.fuelId === fuelId && item.validFrom <= date).sort((a, b) => b.validFrom.localeCompare(a.validFrom))[0]?.price || 0;
  }
  function stock(fuelId) {
    return data.transactions.filter((tx) => tx.fuelId === fuelId).reduce((sum, tx) => sum + Number(tx.stockDelta || 0), 0);
  }
  function pumpStock(pumpId) {
    return data.transactions.filter((tx) => tx.pumpId === pumpId).reduce((sum, tx) => sum + Number(tx.pumpStockDelta || 0), 0);
  }
  function totalStock(fuelId) {
    return stock(fuelId) + data.pumps.filter((item) => item.fuelId === fuelId).reduce((sum, item) => sum + pumpStock(item.id), 0);
  }
  function debt(partyKind, partyId) {
    return data.transactions.filter((tx) => tx.partyKind === partyKind && tx.partyId === partyId).reduce((sum, tx) => sum + Number(tx.debtDelta || 0), 0);
  }
  function txPumpSales(pumpId, date) {
    return data.transactions.filter((tx) => tx.kind === 'sale' && tx.pumpId === pumpId && tx.date === date).reduce((sum, tx) => sum + tx.liters, 0);
  }
  function activeCloses(pumpId) {
    return data.closes.filter((item) => item.pumpId === pumpId && item.active).sort((a, b) => a.date.localeCompare(b.date));
  }
  function expectedClose(pumpItem) {
    const closes = activeCloses(pumpItem.id);
    const last = closes.at(-1);
    return { date: last ? dateOffset(last.date, 1) : pumpItem.startDate, opening: last ? last.closing : pumpItem.initialReading };
  }
  function createTransaction(kind, values) {
    const tx = { id: id(), kind, date: today(), createdAt: new Date().toISOString(), ...values };
    data.transactions.unshift(tx);
    save();
    return tx;
  }
  function selectOptions(list, selected, label) {
    return list.filter((item) => item.active !== false).map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === selected ? 'selected' : ''}>${escapeHtml(label(item))}</option>`).join('');
  }
  function field(label, name, type = 'text', value = '', extra = '') {
    return `<div class="field"><label for="${escapeHtml(name)}">${escapeHtml(label)}</label><input id="${escapeHtml(name)}" name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${extra} required></div>`;
  }
  function selectField(label, name, options, extra = '') {
    return `<div class="field"><label for="${escapeHtml(name)}">${escapeHtml(label)}</label><select id="${escapeHtml(name)}" name="${escapeHtml(name)}" ${extra} required><option value="">Chọn</option>${options}</select></div>`;
  }
  function top(title, subtitle, action = '') {
    return `<div class="page-heading"><div><p class="eyebrow">TRẠM XANH · DỮ LIỆU MẪU</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ''}</div>`;
  }
  function section(title, subtitle = '', action = '') {
    return `<div class="card-heading"><div><h2>${escapeHtml(title)}</h2>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}</div>${action}</div>`;
  }
  function activePumpLabel(item) { return `${item.code} · ${fuel(item.fuelId)?.name || 'Chưa gắn nhiên liệu'}`; }
  function recentTransactions(limit = 7) {
    const rows = data.transactions.slice(0, limit).map((tx) => {
      const name = tx.kind === 'sale' ? `${tx.plate} · ${pump(tx.pumpId)?.code || ''}` : tx.kind === 'pump-fill' || tx.kind === 'legacy-pump-balance' ? `Trụ ${pump(tx.pumpId)?.code || ''}` : tx.kind === 'purchase' ? supplier(tx.supplierId)?.name : tx.partyKind === 'company' ? company(tx.partyId)?.name : supplier(tx.partyId)?.name;
      const kindLabel = { sale: 'Xe công ty', purchase: 'Nhập nhiên liệu', 'pump-fill': 'Nạp vào trụ', 'legacy-pump-balance': 'Cân đối trụ cũ', receipt: 'Thu công nợ', payment: 'Trả nhà cung cấp', retail: 'Bán lẻ chốt trụ', reversal: 'Đảo phiếu', 'opening-stock': 'Tồn đầu kỳ', 'opening-debt': 'Nợ đầu kỳ' }[tx.kind] || 'Điều chỉnh';
      const units = tx.liters ? liters(tx.liters) : tx.stockDelta ? liters(Math.abs(tx.stockDelta)) : '';
      return `<tr><td><span class="badge ${tx.kind === 'sale' ? 'blue' : tx.kind === 'retail' ? 'amber' : ''}">${kindLabel}</span></td><td>${escapeHtml(tx.note || name || '—')}</td><td>${escapeHtml(tx.date)}</td><td>${escapeHtml(units)}</td><td class="amount">${tx.amount ? money(tx.amount) : '—'}</td></tr>`;
    }).join('');
    return rows || '<tr><td class="empty" colspan="5">Chưa có giao dịch.</td></tr>';
  }
  function pumpCards(compact = false) {
    return data.pumps.filter((item) => item.active !== false).map((item) => {
      const expected = expectedClose(item);
      const close = data.closes.find((entry) => entry.pumpId === item.id && entry.date === today() && entry.active);
      const sold = txPumpSales(item.id, today());
      const endExample = expected.opening + sold + 40000;
      if (close) {
        return `<div class="pump-row"><div class="pump-symbol">⛽</div><div><h3>Trụ ${escapeHtml(item.code)}</h3><p>${escapeHtml(fuel(item.fuelId)?.name || '')}</p></div><div class="pump-stats">Trong trụ <b>${liters(pumpStock(item.id))}</b><br>Bán lẻ <b>${liters(close.retailLiters)}</b></div><span class="pump-pill closed">Đã chốt</span></div>`;
      }
      return `<div class="pump-row"><div class="pump-symbol">⛽</div><div><h3>Trụ ${escapeHtml(item.code)}</h3><p>${escapeHtml(fuel(item.fuelId)?.name || '')}</p></div><div class="pump-stats">Trong trụ <b>${liters(pumpStock(item.id))}</b><br>Xe công ty <b>${liters(sold)}</b></div>${compact ? `<span class="pump-pill">Chờ chốt</span>` : `<form class="meter-mini" data-form="close-pump"><input type="hidden" name="pumpId" value="${escapeHtml(item.id)}"><input name="closing" inputmode="decimal" placeholder="${meterValue(endExample)}" aria-label="Chỉ số cuối trụ ${escapeHtml(item.code)}" required><button class="button primary" type="submit">Chốt</button></form>`}</div>`;
    }).join('') || '<div class="empty">Chưa có trụ trong danh mục. Thêm trụ ở mục Danh mục.</div>';
  }
  function renderHome() {
    const fuelItems = data.fuels.filter((item) => item.active !== false);
    const receivable = data.companies.reduce((sum, item) => sum + debt('company', item.id), 0);
    const payable = data.suppliers.reduce((sum, item) => sum + debt('supplier', item.id), 0);
    const todaySales = data.transactions.filter((tx) => tx.kind === 'sale' && tx.date === today()).reduce((sum, tx) => sum + tx.amount, 0);
    const commonTotal = fuelItems.reduce((sum, item) => sum + stock(item.id), 0);
    const pumpsTotal = fuelItems.reduce((sum, item) => sum + data.pumps.filter((pumpItem) => pumpItem.fuelId === item.id).reduce((pumpSum, pumpItem) => pumpSum + pumpStock(pumpItem.id), 0), 0);
    const inventoryRows = fuelItems.map((item) => {
      const inPumps = data.pumps.filter((pumpItem) => pumpItem.fuelId === item.id).reduce((sum, pumpItem) => sum + pumpStock(pumpItem.id), 0);
      return `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${liters(stock(item.id))}</td><td>${liters(inPumps)}</td><td><strong>${liters(totalStock(item.id))}</strong></td><td>${money(currentPrice(item.id))} / L</td></tr>`;
    }).join('');
    return `${top('Tổng quan', 'Theo dõi hoạt động cửa hàng trong ngày.', '<button class="button secondary" data-go="pump-fill">＋ Nạp vào trụ</button><button class="button primary" data-go="sale">＋ Ghi lượt xe</button>')}
      <div class="local-banner"><strong>Dữ liệu riêng của bạn.</strong> Demo này lưu trong bộ nhớ trình duyệt hiện tại. Khách thử trên thiết bị khác sẽ có bộ dữ liệu riêng.</div>
      <section class="metrics">
        <article class="metric"><div class="metric-top">Tồn nhiên liệu <span class="metric-icon">◈</span></div><strong>${liters(commonTotal + pumpsTotal)}</strong><small>Kho chung ${liters(commonTotal)} · Trong trụ ${liters(pumpsTotal)}</small></article>
        <article class="metric"><div class="metric-top">Khách hàng còn nợ <span class="metric-icon">↗</span></div><strong>${money(receivable)}</strong><small>${data.companies.filter((item) => debt('company', item.id) > 0).length} công ty có số dư</small></article>
        <article class="metric"><div class="metric-top">Phải trả nhà cung cấp <span class="metric-icon">↙</span></div><strong>${money(payable)}</strong><small>${data.suppliers.length} nhà cung cấp mẫu</small></article>
        <article class="metric"><div class="metric-top">Bán xe hôm nay <span class="metric-icon">▤</span></div><strong>${money(todaySales)}</strong><small>Chưa gồm bán lẻ chờ chốt trụ</small></article>
      </section>
      <div class="grid-two"><section class="card">${section('Chốt trụ cuối ngày', 'Nhập chỉ số đồng hồ cuối. Bán lẻ được tính tự động.', '<button class="text-link" data-go="closing">Mở trang chốt →</button>')}<div class="pump-list">${pumpCards(true)}</div></section>
      <section class="card">${section('Tồn theo nhiên liệu', 'Kho chung và phần nhiên liệu đang ở từng trụ.')}
        <div class="table-wrap"><table><thead><tr><th>Nhiên liệu</th><th>Kho chung</th><th>Trong trụ</th><th>Tổng tồn</th><th>Giá hiện tại</th></tr></thead><tbody>${inventoryRows || '<tr><td class="empty" colspan="5">Chưa có nhiên liệu.</td></tr>'}</tbody></table></div></section></div>
      <section class="card">${section('Giao dịch gần đây', 'Phiếu và thao tác mới nhất.', '<button class="text-link" data-go="reports">Mở sổ →</button>')}<div class="table-wrap"><table><thead><tr><th>Loại</th><th>Nội dung</th><th>Ngày</th><th>Số lượng</th><th>Thành tiền</th></tr></thead><tbody>${recentTransactions()}</tbody></table></div></section>`;
  }
  function renderSale() {
    const pumps = data.pumps.filter((item) => item.active !== false);
    const selectedPumpId = pumps.some((item) => item.id === data.lastSalePumpId) ? data.lastSalePumpId : pumps[0]?.id || '';
    const pumpOptions = selectOptions(pumps, selectedPumpId, (item) => activePumpLabel(item));
    const vehicles = data.vehicles.filter((item) => item.active !== false);
    return `${top('Bán cho xe công ty', 'Chọn trụ và biển số. Nhiên liệu cùng giá bán lấy theo trụ.')}
      <div class="grid-two"><section class="card">${section('Thông tin lượt đổ')}
        <form data-form="sale">
          ${selectField('Trụ xăng', 'pumpId', pumpOptions, 'data-sale-pump')}
          <div class="form-grid"><div class="field"><label for="plate">Biển số xe</label><input id="plate" name="plate" list="vehicle-list" placeholder="Ví dụ 51A-123.45" autocomplete="off" required><datalist id="vehicle-list">${vehicles.map((item) => `<option value="${escapeHtml(item.plate)}">${escapeHtml(company(item.companyId)?.name || '')}</option>`).join('')}</datalist><p class="hint" id="company-hint">Chọn xe để hiện công ty.</p></div>${field('Ngày đổ', 'date', 'date', today())}</div>
          <p class="hint" id="pump-stock-hint"></p>
          <div class="form-grid"><div class="field"><label for="liters">Số lít</label><input id="liters" name="liters" inputmode="decimal" placeholder="Ví dụ 45,5" required></div><div class="field"><label for="sale-price">Đơn giá (đồng/lít)</label><input id="sale-price" name="price" inputmode="numeric" readonly placeholder="Chọn trụ để lấy giá"></div></div>
          <div class="summary-box sale-preview"><span>Thành tiền tạm tính</span><strong id="sale-total">—</strong></div>
          <div class="field"><label for="sale-note">Ghi chú</label><input id="sale-note" name="note" placeholder="Không bắt buộc"></div>
          <div class="form-actions"><button class="button primary" type="submit">Lưu lượt đổ</button><span class="hint">Chọn đúng trụ đã nạp. Lưu xong có thể ghi lượt kế tiếp ngay.</span></div>
        </form></section>
        <section class="card">${section('Xe công ty mẫu', 'Gõ biển số có hoặc không có dấu phân cách.')}
          <div class="catalog-list">${vehicles.map((item) => `<div class="catalog-item"><div><strong>${escapeHtml(item.plate)}</strong><div class="small-muted">${escapeHtml(company(item.companyId)?.name || '')}</div></div><button class="button secondary" data-use-plate="${escapeHtml(item.plate)}">Chọn xe</button></div>`).join('')}</div>
          <div class="callout" style="margin-top:14px">Bán khách lẻ không nhập ở đây. Cuối ngày chốt chỉ số từng trụ để hệ thống tự tính lít bán lẻ. Nếu tồn trong trụ không đủ, nạp thêm từ kho chung trước.</div>
        </section></div>`;
  }
  function renderClosing() {
    const date = today();
    return `${top('Chốt trụ cuối ngày', 'Nhập chỉ số lít cộng dồn trên đồng hồ của từng trụ.')}
      <div class="notice">Bán lẻ = chỉ số cuối − chỉ số đầu − lít xe công ty đã ghi trên cùng trụ. Số lít bán ra sẽ trừ khỏi tồn trong trụ. Chốt đủ từng ngày, kể cả ngày trụ không bán.</div>
      <section class="card">${section('Các trụ đang hoạt động', 'Lít xe công ty được trừ tự động khi chốt.')}
        <div class="pump-list">${pumpCards(false)}</div>
      </section>
      <section class="card">${section('Lần chốt gần nhất', 'Có thể mở lại ngày cuối với lý do.')}
        <div class="table-wrap"><table><thead><tr><th>Ngày</th><th>Trụ</th><th>Đầu</th><th>Cuối</th><th>Xe công ty</th><th>Bán lẻ</th><th></th></tr></thead><tbody>${data.closes.filter((item) => item.active).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(pump(item.pumpId)?.code || '')}</td><td>${liters(item.opening)}</td><td>${liters(item.closing)}</td><td>${liters(item.companyLiters)}</td><td><strong>${liters(item.retailLiters)}</strong></td><td>${item.date === today() ? `<button class="button secondary" data-reopen="${escapeHtml(item.id)}">Mở lại</button>` : '<span class="small-muted">Đã khóa</span>'}</td></tr>`).join('') || '<tr><td class="empty" colspan="7">Chưa có lần chốt.</td></tr>'}</tbody></table></div>
      </section>`;
  }
  function renderPumpFill() {
    const pumps = data.pumps.filter((item) => item.active !== false);
    const selectedPumpId = pumps.some((item) => item.id === data.lastFillPumpId) ? data.lastFillPumpId : pumps[0]?.id || '';
    const rows = pumps.map((item) => `<div class="catalog-item"><div><strong>Trụ ${escapeHtml(item.code)}</strong><div class="small-muted">${escapeHtml(fuel(item.fuelId)?.name || '')}</div></div><strong>${liters(pumpStock(item.id))}</strong></div>`).join('');
    return `${top('Nạp nhiên liệu vào trụ', 'Chuyển lít từ kho chung sang tồn riêng của trụ.', '<button class="button secondary" data-go="reports">Xem tồn kho</button>')}
      <div class="grid-two"><section class="card">${section('Ghi nhận nạp trụ')}
        <form data-form="pump-fill">
          ${selectField('Trụ nhận nhiên liệu', 'pumpId', selectOptions(pumps, selectedPumpId, (item) => activePumpLabel(item)), 'data-fill-pump')}
          <div class="form-grid">${field('Ngày nạp', 'date', 'date', today())}${field('Số lít chuyển vào trụ', 'liters', 'text', '', 'inputmode="decimal" placeholder="Ví dụ 500"')}</div>
          <div class="summary-box"><span>Kho chung còn lại</span><strong id="fill-common">—</strong></div>
          <div class="summary-box"><span>Tồn trụ sau khi nạp</span><strong id="fill-pump">—</strong></div>
          <div class="field"><label for="fill-note">Ghi chú</label><input id="fill-note" name="note" placeholder="Không bắt buộc"></div>
          <div class="form-actions"><button class="button primary" type="submit">Lưu nạp trụ</button><span class="hint">Kho chung giảm, tồn trụ tăng. Đây là chuyển kho nội bộ, chưa phải lượt bán.</span></div>
        </form></section>
        <section class="card">${section('Tồn hiện tại trong các trụ', 'Xe công ty và bán lẻ cuối ngày sẽ trừ tại đây.')}
          <div class="catalog-list">${rows || '<div class="empty">Chưa có trụ. Thêm trụ trong mục Danh mục.</div>'}</div>
        </section></div>`;
  }
  function renderPurchase() {
    const suppliers = data.suppliers.filter((item) => item.active !== false);
    const fuels = data.fuels.filter((item) => item.active !== false);
    const supplierId = suppliers.some((item) => item.id === data.lastPurchaseSupplierId) ? data.lastPurchaseSupplierId : suppliers[0]?.id || '';
    const fuelId = fuels.some((item) => item.id === data.lastPurchaseFuelId) ? data.lastPurchaseFuelId : fuels[0]?.id || '';
    const lastPrice = data.lastPurchasePrices?.[fuelId] || '';
    return `${top('Nhập nhiên liệu', 'Phiếu nhập tăng tồn và công nợ nhà cung cấp.')}
      <section class="card">${section('Chi tiết phiếu nhập')}
      <form data-form="purchase"><div class="form-grid">${selectField('Nhà cung cấp', 'supplierId', selectOptions(suppliers, supplierId, (item) => item.name))}${field('Ngày nhập', 'date', 'date', today())}</div>
      <div class="form-grid three">${selectField('Nhiên liệu', 'fuelId', selectOptions(fuels, fuelId, (item) => item.name), 'data-purchase-fuel')}${field('Số lít', 'liters', 'text', '', 'inputmode="decimal" placeholder="Ví dụ 1000"')}${field('Giá mua / lít', 'price', 'text', lastPrice, 'inputmode="numeric" placeholder="Ví dụ 20.000"')}</div>
      <div class="summary-box"><span>Thành tiền</span><strong id="purchase-total">—</strong></div>
      <div class="field"><label for="purchase-note">Số chứng từ / ghi chú</label><input id="purchase-note" name="note" placeholder="Không bắt buộc"></div>
      <button class="button primary" type="submit">Lưu phiếu nhập</button><p class="hint">Sau khi lưu, nhà cung cấp và nhiên liệu được giữ lại để nhập phiếu tiếp theo.</p></form></section>`;
  }
  function renderPayments() {
    return `${top('Thu / chi công nợ', 'Ghi khoản khách trả hoặc khoản thanh toán nhà cung cấp.')}
      <div class="grid-two"><section class="card">${section('Ghi nhận thanh toán')}
        <form data-form="payment"><div class="form-grid"><div class="field"><label for="payment-kind">Loại giao dịch</label><select id="payment-kind" name="partyKind"><option value="company">Thu của công ty</option><option value="supplier">Trả nhà cung cấp</option></select></div>${field('Ngày', 'date', 'date', today())}</div>
        <div class="field"><label for="party-id">Đối tác</label><select id="party-id" name="partyId" required></select></div>
        <div class="field"><label for="amount">Số tiền (đồng)</label><input id="amount" name="amount" inputmode="numeric" placeholder="Ví dụ 1.500.000" required></div>
        <div class="field"><label for="pay-method">Phương thức</label><select id="pay-method" name="method"><option>Chuyển khoản</option><option>Tiền mặt</option></select></div>
        <div class="field"><label for="payment-note">Ghi chú</label><input id="payment-note" name="note" placeholder="Mã giao dịch hoặc nội dung"></div>
        <button class="button primary" type="submit">Ghi thanh toán</button></form>
      </section><section class="card">${section('Số dư hiện tại')}
        <div class="catalog-list">${[...data.companies.map((item) => `<div class="catalog-item"><span>${escapeHtml(item.name)}</span><strong>${money(debt('company', item.id))}</strong></div>`), ...data.suppliers.map((item) => `<div class="catalog-item"><span>${escapeHtml(item.name)}</span><strong>${money(debt('supplier', item.id))}</strong></div>`)].join('')}</div>
      </section></div>`;
  }
  function renderReports() {
    const fuelRows = data.fuels.map((item) => {
      const inPumps = data.pumps.filter((pumpItem) => pumpItem.fuelId === item.id).reduce((sum, pumpItem) => sum + pumpStock(pumpItem.id), 0);
      return `<tr><td>${escapeHtml(item.name)}</td><td>${liters(stock(item.id))}</td><td>${liters(inPumps)}</td><td class="amount">${liters(totalStock(item.id))}</td></tr>`;
    }).join('');
    const companyRows = data.companies.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${money(debt('company', item.id))}</td><td>${item.vehicles || data.vehicles.filter((vehicle) => vehicle.companyId === item.id).length} xe</td></tr>`).join('');
    const supplierRows = data.suppliers.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${money(debt('supplier', item.id))}</td></tr>`).join('');
    return `${top('Sổ kho & công nợ', 'Số liệu được tổng hợp từ các giao dịch trên thiết bị này.', '<button class="button secondary" data-go="pump-fill">＋ Nạp vào trụ</button><button class="button secondary" data-print>In trang</button>')}
      <section class="card">${section('Tồn theo vị trí', 'Nạp trụ chuyển kho chung sang tồn trụ; lượt bán trừ tại trụ.')}
        <div class="table-wrap"><table><thead><tr><th>Nhiên liệu</th><th>Kho chung</th><th>Trong các trụ</th><th>Tổng tồn</th></tr></thead><tbody>${fuelRows}</tbody></table></div></section>
      <div class="grid-two"><section class="card">${section('Khách hàng phải thu')}<div class="table-wrap"><table><thead><tr><th>Công ty</th><th>Còn nợ</th><th>Xe</th></tr></thead><tbody>${companyRows}</tbody></table></div></section>
      <section class="card">${section('Nhà cung cấp phải trả')}<div class="table-wrap"><table><thead><tr><th>Nhà cung cấp</th><th>Còn phải trả</th></tr></thead><tbody>${supplierRows}</tbody></table></div></section></div>
      <section class="card">${section('Lịch sử giao dịch')}<div class="table-wrap"><table><thead><tr><th>Loại</th><th>Nội dung</th><th>Ngày</th><th>Số lượng</th><th>Thành tiền</th></tr></thead><tbody>${recentTransactions(100)}</tbody></table></div></section>`;
  }
  function renderCatalog() {
    const list = (items, label, secondary = () => '') => `<div class="catalog-list">${items.map((item) => `<div class="catalog-item"><div><strong>${escapeHtml(label(item))}</strong><div class="small-muted">${escapeHtml(secondary(item))}</div></div><span class="pill-count">${item.active === false ? 'Đã ngừng' : 'Đang dùng'}</span></div>`).join('') || '<div class="empty">Chưa có dữ liệu.</div>'}</div>`;
    return `${top('Danh mục', 'Danh mục mẫu đang có thể chỉnh sửa cục bộ.')}
      <div class="catalog-grid">
        <section class="card">${section('Thêm nhiên liệu')}<form data-form="add-fuel">${field('Tên nhiên liệu', 'name')}<button class="button primary">Thêm nhiên liệu</button></form><hr>${list(data.fuels, (x) => x.name, (x) => `${money(currentPrice(x.id))} / L`)}</section>
        <section class="card">${section('Cập nhật bảng giá')}<form data-form="add-price">${selectField('Nhiên liệu', 'fuelId', selectOptions(data.fuels, '', (x) => x.name))}<div class="form-grid">${field('Giá (đồng/lít)', 'price', 'text', '', 'inputmode="numeric" placeholder="20.500"')}${field('Hiệu lực từ ngày', 'validFrom', 'date', today())}</div><button class="button secondary">Lưu giá</button></form></section>
        <section class="card">${section('Thêm công ty')}<form data-form="add-company">${field('Tên công ty', 'name')}<button class="button primary">Thêm công ty</button></form>${list(data.companies, (x) => x.name, (x) => `${data.vehicles.filter((v) => v.companyId === x.id).length} xe`)}</section>
        <section class="card">${section('Đăng ký xe')}<form data-form="add-vehicle"><div class="form-grid">${field('Biển số', 'plate')}${selectField('Công ty', 'companyId', selectOptions(data.companies, '', (x) => x.name))}</div><button class="button primary">Thêm xe</button></form>${list(data.vehicles, (x) => x.plate, (x) => company(x.companyId)?.name || '')}</section>
        <section class="card">${section('Thêm nhà cung cấp')}<form data-form="add-supplier">${field('Tên nhà cung cấp', 'name')}<button class="button primary">Thêm nhà cung cấp</button></form>${list(data.suppliers, (x) => x.name, (x) => `Còn phải trả ${money(debt('supplier', x.id))}`)}</section>
        <section class="card">${section('Đăng ký trụ')}<form data-form="add-pump"><div class="form-grid">${field('Mã trụ', 'code')}${selectField('Nhiên liệu', 'fuelId', selectOptions(data.fuels, '', (x) => x.name))}</div><div class="form-grid">${field('Ngày bắt đầu', 'startDate', 'date', today())}${field('Chỉ số đồng hồ đầu (lít)', 'initialReading', 'text', '0', 'inputmode="decimal"')}</div><p class="hint">Mỗi trụ trong bản thử gắn với một nhiên liệu. Với trụ nhiều vòi, tạo một mã cho mỗi vòi.</p><button class="button primary">Thêm trụ</button></form>${list(data.pumps, (x) => `Trụ ${x.code}`, (x) => fuel(x.fuelId)?.name || '')}</section>
      </div><div class="callout">Các danh mục ở đây chỉ nằm trong trình duyệt hiện tại. Nút đặt lại trên đầu trang sẽ nạp lại bộ dữ liệu mẫu ban đầu.</div>`;
  }

  function render() {
    const root = $('#app');
    const views = { home: renderHome, sale: renderSale, 'pump-fill': renderPumpFill, closing: renderClosing, purchase: renderPurchase, payments: renderPayments, reports: renderReports, catalog: renderCatalog };
    root.innerHTML = (views[view] || renderHome)();
    $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
    $('#today-label').textContent = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
    updatePaymentParties();
    updateSalePreview();
    updatePumpFillPreview();
    updatePurchasePreview();
  }

  function updatePaymentParties() {
    const kind = $('#payment-kind');
    const target = $('#party-id');
    if (!kind || !target) return;
    const items = kind.value === 'company' ? data.companies : data.suppliers;
    target.innerHTML = '<option value="">Chọn đối tác</option>' + items.filter((item) => item.active !== false).map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} · còn ${money(debt(kind.value, item.id))}</option>`).join('');
  }
  function updateSalePreview() {
    const pumpSelect = $('[data-sale-pump]');
    const plateInput = $('#plate');
    const dateInput = $('[name="date"]', $('#app'));
    const priceInput = $('#sale-price');
    const hint = $('#company-hint');
    const stockHint = $('#pump-stock-hint');
    if (!pumpSelect || !priceInput) return;
    const selectedPump = pump(pumpSelect.value);
    if (selectedPump) priceInput.value = currentPrice(selectedPump.fuelId, dateInput?.value || today()) || '';
    else priceInput.value = '';
    if (stockHint) stockHint.textContent = selectedPump ? `Trụ ${selectedPump.code} còn ${liters(pumpStock(selectedPump.id))}. Nạp từ kho chung nếu số dư chưa đủ.` : '';
    const normalized = (plateInput?.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const vehicle = data.vehicles.find((item) => item.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === normalized);
    if (hint) hint.textContent = vehicle ? `Xe thuộc ${company(vehicle.companyId)?.name || 'chưa gắn công ty'}.` : 'Chọn xe mẫu hoặc nhập biển số đã đăng ký.';
    const litersInput = $('[name="liters"]', $('#app'));
    const total = Number(String(litersInput?.value || 0).replace(',', '.')) * Number(priceInput.value || 0);
    const preview = $('#sale-total');
    if (preview) preview.textContent = Number.isFinite(total) && total > 0 ? money(Math.round(total)) : '—';
  }
  function updatePurchasePreview() {
    const litersInput = $('[data-form="purchase"] [name="liters"]');
    const priceInput = $('[data-form="purchase"] [name="price"]');
    const preview = $('#purchase-total');
    if (preview) {
      const total = Number(String(litersInput?.value || 0).replace(',', '.')) * Number(String(priceInput?.value || 0).replace(/[.,]/g, ''));
      preview.textContent = total > 0 ? money(Math.round(total)) : '—';
    }
  }
  function updatePumpFillPreview() {
    const selected = $('[data-fill-pump]');
    const common = $('#fill-common');
    const inPump = $('#fill-pump');
    if (!selected || !common || !inPump) return;
    const selectedPump = pump(selected.value);
    if (!selectedPump) { common.textContent = '—'; inPump.textContent = '—'; return; }
    const quantity = Number(String($('[data-form="pump-fill"] [name="liters"]')?.value || '').trim().replace(',', '.'));
    const qtyMilli = Number.isFinite(quantity) && quantity > 0 ? Math.round(quantity * 1000) : 0;
    common.textContent = qtyMilli ? `${liters(stock(selectedPump.fuelId) - qtyMilli)} (hiện có ${liters(stock(selectedPump.fuelId))})` : liters(stock(selectedPump.fuelId));
    inPump.textContent = qtyMilli ? `${liters(pumpStock(selectedPump.id) + qtyMilli)} (hiện có ${liters(pumpStock(selectedPump.id))})` : liters(pumpStock(selectedPump.id));
  }
  function parseLiters(value, label = 'Số lít') {
    const raw = String(value || '').trim().replace(',', '.');
    if (!/^\d+(\.\d{1,3})?$/.test(raw)) throw new Error(label + ' cần là số dương, tối đa 3 số lẻ.');
    const milli = Math.round(Number(raw) * 1000);
    if (!Number.isSafeInteger(milli) || milli <= 0) throw new Error(label + ' phải lớn hơn 0.');
    return milli;
  }
  function parseReading(value) {
    const raw = String(value || '').trim().replace(',', '.');
    if (!/^\d+(\.\d{1,3})?$/.test(raw)) throw new Error('Chỉ số đồng hồ cần là số hợp lệ.');
    const milli = Math.round(Number(raw) * 1000);
    if (!Number.isSafeInteger(milli)) throw new Error('Chỉ số đồng hồ vượt giới hạn.');
    return milli;
  }
  function parseMoney(value, label = 'Số tiền') {
    const raw = String(value || '').trim().replace(/\s/g, '').replace(/[.,]/g, '');
    if (!/^\d+$/.test(raw)) throw new Error(label + ' cần là số nguyên đồng.');
    const amount = Number(raw);
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error(label + ' phải lớn hơn 0.');
    return amount;
  }
  function formValues(form) { return Object.fromEntries(new FormData(form).entries()); }

  function submitSale(values) {
    const selectedPump = pump(values.pumpId);
    const normalized = String(values.plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const vehicle = data.vehicles.find((item) => item.active !== false && item.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === normalized);
    const date = values.date || today();
    if (!selectedPump?.active) throw new Error('Hãy chọn trụ đang hoạt động.');
    if (!vehicle) throw new Error('Biển số chưa có trong danh mục xe mẫu. Thêm xe ở Danh mục rồi thử lại.');
    if (!date) throw new Error('Cần chọn ngày đổ.');
    if (date < selectedPump.startDate) throw new Error('Ngày đổ trước ngày bắt đầu theo dõi trụ.');
    if (data.closes.some((item) => item.pumpId === selectedPump.id && item.date === date && item.active)) throw new Error('Trụ đã chốt ngày này. Hãy mở lại chốt gần nhất trước.');
    const qty = parseLiters(values.liters);
    if (pumpStock(selectedPump.id) < qty) throw new Error(`Tồn trụ ${selectedPump.code} chỉ còn ${liters(pumpStock(selectedPump.id))}. Hãy nạp thêm từ kho chung.`);
    const unit = currentPrice(selectedPump.fuelId, date);
    if (!unit) throw new Error('Chưa có giá bán hiệu lực cho nhiên liệu của trụ.');
    const amount = Math.round((qty / 1000) * unit);
    data.lastSalePumpId = selectedPump.id;
    const result = createTransaction('sale', { date, companyId: vehicle.companyId, vehicleId: vehicle.id, plate: vehicle.plate, pumpId: selectedPump.id, fuelId: selectedPump.fuelId, liters: qty, price: unit, amount, stockDelta: 0, pumpStockDelta: -qty, partyKind: 'company', partyId: vehicle.companyId, debtDelta: amount, note: values.note || `Xe ${vehicle.plate}` });
    notify(`Đã lưu lượt đổ ${liters(qty)} · ${money(amount)}.`);
    view = 'sale';
    render();
    requestAnimationFrame(() => $('#plate')?.focus());
    return result;
  }

  function submitPumpFill(values) {
    const selectedPump = pump(values.pumpId);
    if (!selectedPump?.active) throw new Error('Hãy chọn trụ đang hoạt động.');
    const qty = parseLiters(values.liters);
    const commonStock = stock(selectedPump.fuelId);
    if (commonStock < qty) throw new Error(`Kho chung chỉ còn ${liters(commonStock)} ${fuel(selectedPump.fuelId)?.name || ''}.`);
    data.lastFillPumpId = selectedPump.id;
    createTransaction('pump-fill', { date: values.date || today(), pumpId: selectedPump.id, fuelId: selectedPump.fuelId, liters: qty, stockDelta: -qty, pumpStockDelta: qty, note: values.note || `Nạp vào trụ ${selectedPump.code}` });
    notify(`Đã chuyển ${liters(qty)} vào trụ ${selectedPump.code}.`);
    view = 'pump-fill';
    render();
    requestAnimationFrame(() => $('[data-form="pump-fill"] [name="liters"]')?.focus());
  }

  function submitClose(values) {
    const selectedPump = pump(values.pumpId);
    if (!selectedPump?.active) throw new Error('Không tìm thấy trụ đang hoạt động.');
    const date = today();
    const priorClose = activeCloses(selectedPump.id).at(-1);
    const opening = priorClose ? priorClose.closing : selectedPump.initialReading;
    const expectedDate = priorClose ? dateOffset(priorClose.date, 1) : selectedPump.startDate;
    if (date !== expectedDate) throw new Error(`Trụ này cần chốt ngày ${expectedDate}. Demo chỉ cho chốt lần lượt từng ngày.`);
    if (data.closes.some((item) => item.pumpId === selectedPump.id && item.date === date && item.active)) throw new Error('Trụ đã chốt ngày hôm nay.');
    const closing = parseReading(values.closing);
    if (closing < opening) throw new Error('Chỉ số cuối không được nhỏ hơn chỉ số đầu.');
    const companyLiters = txPumpSales(selectedPump.id, date);
    const retailLiters = closing - opening - companyLiters;
    if (retailLiters < 0) throw new Error('Lượt xe công ty vượt chênh lệch đồng hồ. Kiểm tra lại trụ hoặc chỉ số.');
    if (pumpStock(selectedPump.id) < retailLiters) throw new Error(`Tồn trụ ${selectedPump.code} chỉ còn ${liters(pumpStock(selectedPump.id))}, không đủ ghi bán lẻ. Hãy nạp thêm từ kho chung.`);
    const close = { id: id(), pumpId: selectedPump.id, date, opening, closing, companyLiters, retailLiters, active: true, createdAt: new Date().toISOString(), reason: '' };
    data.closes.push(close);
    createTransaction('retail', { pumpId: selectedPump.id, fuelId: selectedPump.fuelId, liters: retailLiters, stockDelta: 0, pumpStockDelta: -retailLiters, debtDelta: 0, closeId: close.id, note: `Bán lẻ chốt trụ ${selectedPump.code}` });
    save();
    notify(`Đã chốt trụ ${selectedPump.code}. Bán lẻ tự tính: ${liters(retailLiters)}.`);
    render();
  }

  function reopenClose(closeId) {
    const close = data.closes.find((item) => item.id === closeId && item.active);
    if (!close) throw new Error('Không tìm thấy lần chốt đang hoạt động.');
    const latest = activeCloses(close.pumpId).at(-1);
    if (latest?.id !== close.id) throw new Error('Mở lại các ngày từ gần nhất trở về trước.');
    const reason = window.prompt('Lý do mở lại chốt trụ:');
    if (!reason?.trim()) return;
    close.active = false;
    close.reason = reason.trim();
    const retailTx = data.transactions.find((tx) => tx.kind === 'retail' && tx.closeId === close.id);
    if (retailTx) createTransaction('reversal', { fuelId: retailTx.fuelId, pumpId: close.pumpId, liters: close.retailLiters, stockDelta: -(retailTx.stockDelta || 0), pumpStockDelta: -(retailTx.pumpStockDelta || 0), debtDelta: 0, note: `Đảo bán lẻ trụ ${pump(close.pumpId)?.code}: ${close.reason}`, originalId: retailTx.id });
    save();
    notify('Đã mở lại chốt gần nhất. Phiếu bán lẻ cũ vẫn được giữ trong lịch sử.');
    render();
  }

  function handleSubmit(form) {
    const values = formValues(form);
    const type = form.dataset.form;
    if (type === 'sale') return submitSale(values);
    if (type === 'close-pump') return submitClose(values);
    if (type === 'pump-fill') return submitPumpFill(values);
    if (type === 'purchase') {
      const qty = parseLiters(values.liters);
      const price = parseMoney(values.price, 'Đơn giá');
      const amount = Math.round(qty / 1000 * price);
      data.lastPurchaseSupplierId = values.supplierId;
      data.lastPurchaseFuelId = values.fuelId;
      data.lastPurchasePrices ||= {};
      data.lastPurchasePrices[values.fuelId] = price;
      createTransaction('purchase', { date: values.date || today(), supplierId: values.supplierId, fuelId: values.fuelId, liters: qty, price, amount, stockDelta: qty, partyKind: 'supplier', partyId: values.supplierId, debtDelta: amount, note: values.note || 'Nhập nhiên liệu' });
      notify(`Đã lưu phiếu nhập ${liters(qty)} · ${money(amount)}.`);
      view = 'purchase'; render(); requestAnimationFrame(() => $('[data-form="purchase"] [name="liters"]')?.focus()); return;
    }
    if (type === 'payment') {
      const amount = parseMoney(values.amount);
      const outstanding = debt(values.partyKind, values.partyId);
      if (!values.partyId) throw new Error('Hãy chọn đối tác.');
      if (amount > outstanding) throw new Error('Số tiền vượt công nợ hiện tại.');
      createTransaction(values.partyKind === 'company' ? 'receipt' : 'payment', { date: values.date || today(), partyKind: values.partyKind, partyId: values.partyId, amount, debtDelta: -amount, note: `${values.method} · ${values.note || ''}`.trim() });
      notify(`Đã ghi ${values.partyKind === 'company' ? 'khoản thu' : 'khoản trả'} ${money(amount)}.`);
      view = 'reports'; render(); return;
    }
    if (type === 'add-fuel') {
      const name = values.name.trim();
      if (!name) throw new Error('Nhập tên nhiên liệu.');
      data.fuels.push({ id: id(), name, active: true }); save(); notify('Đã thêm nhiên liệu.'); render(); return;
    }
    if (type === 'add-company') {
      const name = values.name.trim();
      if (!name) throw new Error('Nhập tên công ty.');
      data.companies.push({ id: id(), name, active: true }); save(); notify('Đã thêm công ty.'); render(); return;
    }
    if (type === 'add-supplier') {
      const name = values.name.trim();
      if (!name) throw new Error('Nhập tên nhà cung cấp.');
      data.suppliers.push({ id: id(), name, active: true }); save(); notify('Đã thêm nhà cung cấp.'); render(); return;
    }
    if (type === 'add-vehicle') {
      const plate = values.plate.trim().toUpperCase();
      const key = plate.replace(/[^A-Z0-9]/g, '');
      if (key.length < 5) throw new Error('Biển số xe chưa hợp lệ.');
      if (data.vehicles.some((item) => item.plate.replace(/[^A-Z0-9]/gi, '').toUpperCase() === key)) throw new Error('Biển số xe đã có trong danh mục.');
      data.vehicles.push({ id: id(), plate, companyId: values.companyId, active: true }); save(); notify('Đã đăng ký xe.'); render(); return;
    }
    if (type === 'add-pump') {
      const code = values.code.trim().toUpperCase();
      if (!code) throw new Error('Nhập mã trụ.');
      if (data.pumps.some((item) => item.code.toUpperCase() === code)) throw new Error('Mã trụ đã tồn tại.');
      data.pumps.push({ id: id(), code, fuelId: values.fuelId, startDate: values.startDate, initialReading: parseReading(values.initialReading), active: true }); save(); notify('Đã đăng ký trụ.'); render(); return;
    }
    if (type === 'add-price') {
      const price = parseMoney(values.price, 'Giá bán');
      data.prices.push({ id: id(), fuelId: values.fuelId, validFrom: values.validFrom, price }); save(); notify('Đã lưu giá có hiệu lực.'); render(); return;
    }
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-view]');
    if (nav) { view = nav.dataset.view; render(); if (view === 'sale') requestAnimationFrame(() => $('#plate')?.focus()); if (view === 'pump-fill') requestAnimationFrame(() => $('[data-form="pump-fill"] [name="liters"]')?.focus()); return; }
    const go = event.target.closest('[data-go]');
    if (go) { view = go.dataset.go; render(); if (view === 'sale') requestAnimationFrame(() => $('#plate')?.focus()); if (view === 'pump-fill') requestAnimationFrame(() => $('[data-form="pump-fill"] [name="liters"]')?.focus()); return; }
    const usePlate = event.target.closest('[data-use-plate]');
    if (usePlate) { view = 'sale'; render(); const input = $('#plate'); input.value = usePlate.dataset.usePlate; updateSalePreview(); $('#liters')?.focus(); return; }
    const reopen = event.target.closest('[data-reopen]');
    if (reopen) { try { reopenClose(reopen.dataset.reopen); } catch (error) { notify(error.message); } return; }
    if (event.target.id === 'reset-demo') {
      const backdrop = document.createElement('div');
      backdrop.className = 'demo-dialog-backdrop';
      backdrop.innerHTML = '<section class="demo-dialog"><h2>Nạp lại dữ liệu mẫu?</h2><p>Thao tác này xóa các giao dịch bạn vừa tạo trên trình duyệt này và nạp lại dữ liệu demo ban đầu.</p><div class="dialog-actions"><button class="button secondary" data-cancel-reset>Giữ dữ liệu</button><button class="button danger" data-confirm-reset>Đặt lại demo</button></div></section>';
      document.body.append(backdrop); return;
    }
    if (event.target.closest('[data-cancel-reset]')) { event.target.closest('.demo-dialog-backdrop')?.remove(); return; }
    if (event.target.closest('[data-confirm-reset]')) { localStorage.removeItem(STORAGE_KEY); data = seedData(); save(); view = 'home'; event.target.closest('.demo-dialog-backdrop')?.remove(); notify('Đã nạp lại dữ liệu mẫu.'); render(); return; }
    if (event.target.closest('[data-print]')) window.print();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-form]');
    if (!form) return;
    event.preventDefault();
    try { handleSubmit(form); } catch (error) { notify(error.message); }
  });

  document.addEventListener('input', (event) => {
    if (event.target.matches('[data-sale-pump],#plate,#liters,#sale-price,[data-form="purchase"] [name="liters"],[data-form="purchase"] [name="price"]')) {
      updateSalePreview(); updatePurchasePreview();
      if (event.target.id === 'plate') {
        const normalized = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const vehicle = data.vehicles.find((item) => item.plate.toUpperCase().replace(/[^A-Z0-9]/g, '') === normalized);
        if ($('#company-hint')) $('#company-hint').textContent = vehicle ? `Xe thuộc ${company(vehicle.companyId)?.name || ''}.` : 'Chọn xe mẫu hoặc nhập biển số đã đăng ký.';
      }
    }
    if (event.target.matches('[data-form="pump-fill"] [name="liters"]')) updatePumpFillPreview();
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'payment-kind') updatePaymentParties();
    if (event.target.matches('[data-sale-pump]')) { data.lastSalePumpId = event.target.value; save(); updateSalePreview(); }
    if (event.target.id === 'date') updateSalePreview();
    if (event.target.matches('[data-fill-pump]')) { data.lastFillPumpId = event.target.value; save(); updatePumpFillPreview(); }
    if (event.target.matches('[data-purchase-fuel]')) {
      const priceInput = $('[data-form="purchase"] [name="price"]');
      if (priceInput) priceInput.value = data.lastPurchasePrices?.[event.target.value] || '';
      updatePurchasePreview();
    }
  });

  render();
})();
