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
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-brand-primary mb-2">Analyze a Property</h2>
            <p className="text-gray-600 mb-6">Enter a property address and type. We'll find the data and help you analyze it.</p>
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
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
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
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                        aria-label="Property Type"
                    >
                       {Object.values(propertyTypes).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !address.trim()}
                    className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 flex items-center justify-center"
                    aria-label="Find and Analyze Property"
                >
                    {isLoading ? <Loader /> : 'Find & Analyze Property'}
                </button>
            </form>
        </div>
    );
};
