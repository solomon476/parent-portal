import React, { useState } from 'react';
import { CreditCard, CheckCircle, Search, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const PaymentFlow = () => {
  const { activeChild, t, addPayment } = useAppContext();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [search, setSearch] = useState('');

  if (!activeChild) return null;

  const handlePay = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.8) {
        setStatus('error');
      } else {
        addPayment(activeChild.id, amount, method);
        setStatus('success');
      }
    }, 1500);
  };

  const filteredHistory = activeChild.fees.history.filter(tx => 
    tx.ref.toLowerCase().includes(search.toLowerCase()) || tx.date.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--danger), #B91C1C)', color: 'white' }}>
        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{t.currentBalance}</div>
        <div style={{ fontSize: '2rem', fontWeight: 700 }}>
          {activeChild.fees.currency} {activeChild.fees.totalBalance.toLocaleString()}
        </div>
      </div>

      <h2 className="section-title">{t.checkout}</h2>
      
      {status === 'success' ? (
        <div className="success-state">
          <CheckCircle className="success-icon" />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.success}</h3>
          <button className="btn-primary" onClick={() => { setStatus('idle'); setAmount(''); }}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          
          {status === 'error' && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              {t.error}
            </div>
          )}

          <div className="form-group">
            <label>Amount ({activeChild.fees.currency})</label>
            <input 
              type="number" 
              className="form-control" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select className="form-control" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="mpesa">Mobile Money (M-PESA)</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <div className="loader" style={{ padding: 0 }}><CreditCard size={20} /> Processing...</div>
            ) : (
              <><CreditCard size={20} /> {t.payNow}</>
            )}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>{t.paymentHistory}</h2>
        <div style={{ position: 'relative', width: '150px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            style={{ paddingLeft: '2rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Ref</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td style={{ fontFamily: 'monospace' }}>{tx.ref}</td>
                  <td>{tx.amount.toLocaleString()}</td>
                  <td>
                    <span className="status-badge">{tx.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {t.noPaymentHistory}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
