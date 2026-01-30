import React from "react";
export function Card({ children }) {
    return (
    <div className="rounded-2xl border bg-white shadow-sm">
    {children}
    </div>
    );
    }
    export function CardContent({ children }) {
        return <div className="p-6">{children}</div>;
        }