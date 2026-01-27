import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { CreditCard } from 'lucide-react';

const Payment = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
                <Card style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="flex items-center gap-2 mb-4" style={{ color: '#1e3a8a', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        <div style={{ background: '#1e3a8a', color: 'white', padding: '0.25rem', borderRadius: '4px' }}>
                            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>1</span>
                        </div>
                        Razorpay
                    </div>

                    <h2 className="text-xl font-bold mb-6">Complete your payment</h2>

                    <div className="mb-6">
                        <p className="text-secondary mb-1">Work Payment</p>
                        <div className="flex justify-between items-center">
                            <span>Amount</span>
                            <span className="font-bold text-xl">₹350.00</span>
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    <h3 className="font-bold mb-4">Card information</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <Input label="Card number" placeholder="0000 0000 0000 0000" />
                            <div className="flex justify-end gap-2 mt-1">
                                <span style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 4px', borderRadius: '2px' }}>VISA</span>
                                <span style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 4px', borderRadius: '2px' }}>MasterCard</span>
                                <span style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 4px', borderRadius: '2px' }}>RuPay</span>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <Input label="MM / YY" placeholder="12 / 24" className="flex-1" />
                            <Input label="CVC" placeholder="123" className="flex-1" />
                        </div>

                        <Button variant="primary" block style={{ padding: '0.75rem' }}>Pay ₹ 350.00</Button>

                        <p className="text-center mt-4 text-sm text-secondary">
                            By proceeding, you agree to the Terms & Conditions.
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Payment;
