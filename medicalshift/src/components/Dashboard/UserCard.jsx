export default function UserCard({ user }) {
    if (!user) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    const fullName = user.name || user.email || "Usuario";

    return (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{fullName}</h2>
                    <div className="space-y-2">
                        {user.associateNumber && (
                            <div className="flex items-center gap-2">
                                <span className="text-sky-200">Número de asociado:</span>
                                <span className="font-semibold">{user.associateNumber}</span>
                            </div>
                        )}
                        {user.plan && (
                            <div className="flex items-center gap-2">
                                <span className="text-sky-200">Plan:</span>
                                <span className="font-semibold">{user.plan}</span>
                            </div>
                        )}
                        {user.documentNumber && (
                            <div className="flex items-center gap-2">
                                <span className="text-sky-200">DNI:</span>
                                <span className="font-semibold">{user.documentNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}



