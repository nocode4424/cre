import React, { useState } from 'react';
import { PropertyType, propertyTypes } from '../types';
import { Loader } from './Loader';

interface AddressFormProps {
    onSubmit: (address: string, propertyType: PropertyType) => void;
    isLoading: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, isLoading }) => {
    const [address, setAddress] = useState<string>('');
    const [propertyType, setPropertyType] = useState<PropertyType>(propertyTypes.SINGLE_FAMILY);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim()) {
            onSubmit(address, propertyType);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-primary-800 mb-2">Analyze a Property</h2>
            <p className="text-secondary mb-6">Enter a property address. Our AI will find the data and help you analyze it.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Property Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        placeholder="e.g., 123 Main St, Anytown, USA"
                        required
                        aria-label="Property Address"
                    />
                </div>
                <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                        Property Type
                    </label>
                    <select
                        id="propertyType"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white"
                        aria-label="Property Type"
                    >
                       {Object.values(propertyTypes).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !address.trim()}
                    className="w-full bg-primary-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-300 disabled:bg-gray-400 flex items-center justify-center shadow-sm"
                    aria-label="Find and Analyze Property"
                >
                    {isLoading ? <Loader /> : 'Find & Analyze Property'}
                </button>
            </form>
        </div>
    );
};