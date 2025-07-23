"use client";

import { useState } from "react";
import {useUser} from "@clerk/nextjs"

export const Counter = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [mealsLogged, setMealsLogged] = useState(0);

    if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div>Sign in to track meals</div>;

    return (
        <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
                Welcome back, {user.firstName}!
            </h3>
            <button 
                onClick={() => setMealsLogged(mealsLogged + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Meals logged today: {mealsLogged}
            </button>
        </div>
    );
};
