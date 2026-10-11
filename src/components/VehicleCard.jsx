import React, { useState } from 'react';
import { Car, Bike, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

export const VehicleCard = ({ vehicle, onEdit, onDelete, onSetDefault }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [model, setModel] = useState(vehicle.model);
  const [plateNumber, setPlateNumber] = useState(vehicle.plateNumber);
  const [type, setType] = useState(vehicle.type);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!plateNumber.trim() || !model.trim()) return;
    onEdit(vehicle.id, {
      model,
      plateNumber: plateNumber.toUpperCase(),
      type
    });
    setShowEditModal(false);
  };

  const isCar = vehicle.type === 'Car';

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isCar ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {isCar ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {vehicle.model}
                </h4>
                <div className="text-xs font-mono font-bold text-slate-500 tracking-wider mt-0.5">
                  {vehicle.plateNumber}
                </div>
              </div>
            </div>

            {vehicle.isDefault ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Default
              </span>
            ) : (
              <button
                onClick={() => onSetDefault(vehicle.id)}
                className="text-[11px] font-medium text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Set Default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              {vehicle.type}
            </span>
            {vehicle.fuel && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {vehicle.fuel}
              </span>
            )}
            {vehicle.color && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {vehicle.color}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Edit Vehicle Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Vehicle"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
          <Input
            label="Vehicle Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Hyundai i20"
            required
          />

          <Input
            label="Registration / Number Plate"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            placeholder="e.g. KA-01-AB-1234"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Car', 'Bike'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    type === t
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Vehicle Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Vehicle"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-600">
            Are you sure you want to remove <strong>{vehicle.model} ({vehicle.plateNumber})</strong> from your garage?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDeleteModal(false)}
            >
              Keep Vehicle
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                onDelete(vehicle.id);
                setShowDeleteModal(false);
              }}
            >
              Yes, Remove
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VehicleCard;
