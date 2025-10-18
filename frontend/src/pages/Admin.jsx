import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-green-500/20 border-green-500/30',
      iconColor: 'text-green-400',
      buttonColor: 'bg-green-600/40 border-green-500/40 text-green-100 hover:bg-green-600/60',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      iconColor: 'text-yellow-400',
      buttonColor: 'bg-yellow-600/40 border-yellow-500/40 text-yellow-100 hover:bg-yellow-600/60',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-red-500/20 border-red-500/30',
      iconColor: 'text-red-400',
      buttonColor: 'bg-red-600/40 border-red-500/40 text-red-100 hover:bg-red-600/60',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload and Delete videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      iconColor: 'text-purple-400',
      buttonColor: 'bg-purple-600/40 border-purple-500/40 text-purple-100 hover:bg-purple-600/60',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4 drop-shadow-lg">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-lg">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl hover:bg-gray-900/40 hover:border-gray-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="p-8 items-center text-center">
                  {/* Icon */}
                  <div className={`${option.bgColor} border p-4 rounded-2xl mb-6 mx-auto w-fit backdrop-blur-md transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent size={32} className={option.iconColor} />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-100 mb-3">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <NavLink
                      to={option.route}
                      className={`btn backdrop-blur-md ${option.buttonColor} border transition-all duration-300 shadow-lg font-semibold px-8 py-3 rounded-xl`}
                    >
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;