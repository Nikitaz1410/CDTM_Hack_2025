import React from 'react';
import { User, Ruler, Dumbbell, Edit } from 'lucide-react';

const PersonalInfoCard = ({ user, onEdit }) => {
    // Calculate BMI if height and weight are available
    const calculateBMI = () => {
        if (user?.weight && user?.height) {
            const weightInKg = parseFloat(user.weight);
            const heightInM = parseFloat(user.height) / 100; // Convert cm to m
            const bmi = weightInKg / (heightInM * heightInM);
            return bmi.toFixed(1);
        }
        return null;
    };

    const getBMIStatus = (bmi) => {
        if (!bmi) return null;
        const bmiNum = parseFloat(bmi);
        if (bmiNum < 18.5) return { status: 'Untergewicht', color: 'text-blue-600' };
        if (bmiNum < 25) return { status: 'Normalgewicht', color: 'text-green-600' };
        if (bmiNum < 30) return { status: 'Übergewicht', color: 'text-yellow-600' };
        if (bmiNum < 10000) return { status: 'Adipositas', color: 'text-red-600' };
        return { status: 'Golem', color: 'text-red-600' };
    };

    const bmi = calculateBMI();
    const bmiStatus = getBMIStatus(bmi);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <User size={22} />
                    </div>
                    <h3 className="text-lg font-semibold">Persönliche Daten</h3>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <Edit size={16} className="text-gray-400" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium">
                                {user?.first} {user?.last}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Ruler size={16} className="text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Größe</p>
                            <p className="font-medium">
                                {user?.height ? `${user.height} cm` : 'Nicht angegeben'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <Dumbbell size={16} className="text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Gewicht</p>
                            <p className="font-medium">
                                {user?.weight ? `${user.weight} kg` : 'Nicht angegeben'}
                            </p>
                        </div>
                    </div>

                    {bmi && (
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                <div className="w-3 h-3 border border-gray-400 rounded-sm" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">BMI</p>
                                <p className="font-medium">
                                    {bmi}{' '}
                                    <span className={`text-xs ${bmiStatus?.color}`}>
                                        ({bmiStatus?.status})
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional info row if we have it */}
            {user?.email && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-gray-300 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-sm">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoCard;
