import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const SaaSDemo = () => {
    const [coupon, setCoupon] = useState('');
    const [price, setPrice] = useState(100);
    const [message, setMessage] = useState('');

    const applyCoupon = () => {
        if (coupon === 'SAVE10') {
            setPrice(90);
            setMessage('Coupon applied! 10% discount.');
        } else {
            setMessage('Invalid coupon.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-10 text-slate-800">Vortex SaaS Store</h1>

            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Enterprise License</CardTitle>
                    <CardDescription>Unlock the full power of Vortex.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <div className="text-3xl font-bold text-green-600">${price}.00</div>
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="coupon" className="text-sm font-medium">Discount Code</label>
                            <input
                                id="coupon"
                                placeholder="Enter code"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                         {message && <div className="text-sm text-blue-600">{message}</div>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Buy Now</Button>
                </CardFooter>
            </Card>

            <div className="mt-10 p-4 border rounded bg-white w-[350px]">
                <h3 className="font-bold mb-2">Login to Account</h3>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-2 p-2 border rounded"
                />
                <Button className="w-full">Sign In</Button>
            </div>
        </div>
    );
};

export default SaaSDemo;
