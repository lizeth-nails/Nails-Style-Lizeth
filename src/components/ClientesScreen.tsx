import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Phone, AlertTriangle, User, ShieldAlert, Check, X } from 'lucide-react';
import { INITIAL_CLIENTS } from '../lib/constants';
import { Client } from '../types/salon';

export const ClientesScreen: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para Modal de Edición / Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'female' as 'female' | 'male',
    notes: '',
    has_allergies: false,
  });

  // Estado para Modal de Confirmación de Eliminación
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Filtrado de clientes por búsqueda
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  // Abrir modal para crear cliente nuevo
  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '+57 ',
      gender: 'female',
      notes: '',
      has_allergies: false,
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar cliente existente
  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      gender: client.gender,
      notes: client.notes || '',
      has_allergies: client.has_allergies || false,
    });
    setIsModalOpen(true);
  };

  // Guardar Cambios (Crear o Editar)
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClient) {
      // Editar
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                name: formData.name,
                phone: formData.phone,
                gender: formData.gender,
                notes: formData.notes,
                has_allergies: formData.has_allergies,
              }
            : c
        )
      );
    } else {
      // Crear
      const newClient: Client = {
        id: `c_${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        notes: formData.notes,
        has_allergies: formData.has_allergies,
        last_service_date: 'Sin servicios registrados',
        last_service_name: 'Cliente nuevo',
      };
      setClients((prev) => [newClient, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Eliminar Cliente
  const handleConfirmDelete = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Encabezado y Barra de Búsqueda */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Directorio de Clientes</h2>
            <p className="text-xs text-gray-500">Gestión de fichas, preferencias y eliminación</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Clientes Registrados ({filteredClients.length})
          </span>
        </div>

        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-pink-200 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    client.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={client.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-pink-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{client.name}</h3>
                    {client.has_allergies && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Alergia
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {client.phone}
                  </p>
                </div>
              </div>

              {/* Botones de Acción: Editar y Eliminar */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(client)}
                  title="Editar cliente"
                  className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setClientToDelete(client)}
                  title="Eliminar cliente"
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notas y Preferencias */}
            {client.notes && (
              <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-600 border border-gray-100">
                <strong className="text-gray-700">Preferencias: </strong>
                {client.notes}
              </div>
            )}

            {/* Último servicio */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-50">
              <span>Último servicio: <strong className="text-gray-600">{client.last_service_name}</strong></span>
              <span>{client.last_service_date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Crear / Editar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-pink-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: María Camila Pérez"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Teléfono WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+57 300 000 0000"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'female' | 'male' })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  >
                    <option value="female">Femenino (Dama)</option>
                    <option value="male">Masculino (Caballero)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Notas y Preferencias</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Escribe tonos preferidos, alergias, diseño habitual..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="has_allergies"
                  checked={formData.has_allergies}
                  onChange={(e) => setFormData({ ...formData, has_allergies: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500 h-4 w-4"
                />
                <label htmlFor="has_allergies" className="text-gray-700 font-medium">
                  Cliente presenta alergias o condiciones especiales
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmación de Eliminación */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl border border-rose-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base">¿Eliminar Cliente?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Estás a punto de eliminar a <strong className="text-gray-800">{clientToDelete.name}</strong>. Esta acción quitará su ficha del directorio.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-all shadow-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
