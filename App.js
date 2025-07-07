import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from './logo.png';
import './App.css';

function App() {
  const [invoice, setInvoice] = useState({
    yourName: '',
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: '', price: '' }],
  });

  // Calculate total safely
  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return total + qty * price;
    }, 0);
  };

  // Handle changes for invoice fields
  const handleFieldChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes for each item
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    setInvoice((prev) => ({ ...prev, items: newItems }));
  };

  // Add a new empty item
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: '', price: '' }],
    }));
  };

  // Remove item by index
  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice((prev) => ({ ...prev, items: newItems.length ? newItems : [{ description: '', quantity: '', price: '' }] }));
  };

  // Generate PDF using html2canvas + jsPDF for styled output
  const generatePDF = () => {
    const input = document.getElementById('invoice-preview');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <p className="subtitle">
        Simple, fast invoicing for freelancers and small businesses.
      </p>

      <section className="form-section">
        <label className="label">
          Your Name:
          <input
            className="input"
            type="text"
            value={invoice.yourName}
            onChange={(e) => handleFieldChange('yourName', e.target.value)}
            placeholder="Your full name or business name"
          />
        </label>

        <label className="label">
          Client Name:
          <input
            className="input"
            type="text"
            value={invoice.clientName}
            onChange={(e) => handleFieldChange('clientName', e.target.value)}
            placeholder="Client's full name or business name"
          />
        </label>

        <label className="label">
          Client Email:
          <input
            className="input"
            type="email"
            value={invoice.clientEmail}
            onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
            placeholder="Client's email address"
          />
        </label>
      </section>

      <section className="form-section items-section">
        <h3>Invoice Items</h3>

        <div className="items-header">
          <div>Description</div>
          <div>Quantity</div>
          <div>Price (£)</div>
          <div>Remove</div>
        </div>

        {invoice.items.map((item, idx) => (
          <div className="items-row" key={idx}>
            <input
              className="input description"
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
            />
            <input
              className="input quantity"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
            />
            <input
              className="input price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.price}
              onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
            />
            <button className="remove-btn" onClick={() => removeItem(idx)} aria-label="Remove item">&times;</button>
          </div>
        ))}

        <button className="add-item-btn" onClick={addItem}>
          + Add Item
        </button>
      </section>

      <section className="total-section">
        <h2>
          Total: £{calculateTotal().toFixed(2)}
        </h2>
        <button className="download-btn" onClick={generatePDF}>
          Download PDF
        </button>
      </section>

      {/* Hidden preview for PDF generation */}
      <div id="invoice-preview" className="invoice-preview">
        <header className="preview-header">
          <img src={logo} alt="Logo" className="preview-logo" />
          <h1 className="preview-title">Invoice</h1>
        </header>

        <section className="preview-info">
          <p><strong>From:</strong> {invoice.yourName || '...'}</p>
          <p><strong>To:</strong> {invoice.clientName || '...'}</p>
          <p><strong>Email:</strong> {invoice.clientEmail || '...'}</p>
        </section>

        <section className="preview-items">
          <table className="preview-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price (£)</th>
                <th>Total (£)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => {
                const qty = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;
                return (
                  <tr key={idx}>
                    <td>{item.description || '...'}</td>
                    <td>{qty}</td>
                    <td>{price.toFixed(2)}</td>
                    <td>{(qty * price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="preview-total">
          <h2>Total: £{calculateTotal().toFixed(2)}</h2>
        </section>
      </div>
    </div>
  );
}

export default App;
