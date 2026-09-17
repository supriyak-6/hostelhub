import React, { useState } from 'react';
import { store } from '../../services/store';
import { Room } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  DoorClosed,
  PlusCircle,
  Search,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Bed,
} from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // New room state
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    block: 'Block A',
    floor: 1,
    capacity: 2,
    type: 'Double AC' as const,
    monthlyRent: 8500,
    amenities: ['AC', 'Attached Bath', 'Balcony', 'WiFi', 'Geyser'],
  });

  const rooms = store.rooms.filter((r) => {
    const matchesBlock = selectedBlock === 'ALL' || r.block === selectedBlock;
    const matchesFloor = selectedFloor === 'ALL' || r.floor.toString() === selectedFloor;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBlock && matchesFloor && matchesStatus && matchesSearch;
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.roomNumber.trim()) {
      store.showToast('error', 'Room number is required');
      return;
    }

    store.addRoom({
      roomNumber: newRoom.roomNumber,
      block: newRoom.block,
      floor: newRoom.floor,
      capacity: newRoom.capacity,
      type: newRoom.type,
      status: 'AVAILABLE',
      monthlyRent: newRoom.monthlyRent,
      amenities: newRoom.amenities,
    });

    setIsAddRoomOpen(false);
    setNewRoom({
      roomNumber: '',
      block: 'Block A',
      floor: 1,
      capacity: 2,
      type: 'Double AC',
      monthlyRent: 8500,
      amenities: ['AC', 'Attached Bath', 'Balcony', 'WiFi', 'Geyser'],
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Hostel Rooms & Inventory</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor room capacities, current occupancy, and amenity configurations
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search room #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Block Filter */}
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Vacant / Available</option>
            <option value="PARTIALLY_OCCUPIED">Partial Occupancy</option>
            <option value="FULL">Full Occupancy</option>
            <option value="MAINTENANCE">Maintenance Hold</option>
          </select>

          <button
            onClick={() => setIsAddRoomOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {rooms.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No rooms found matching the filter options.
          </div>
        ) : (
          rooms.map((room) => {
            const isFull = room.occupancy >= room.capacity;
            const vacancies = room.capacity - room.occupancy;

            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-md flex flex-col justify-between space-y-3 ${
                  room.status === 'MAINTENANCE'
                    ? 'border-amber-300 bg-amber-50/20'
                    : isFull
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-blue-200 hover:border-blue-400 ring-1 ring-blue-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-slate-900 font-mono text-base">
                      {room.roomNumber}
                    </span>
                    <StatusBadge status={room.status} />
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    {room.block} • Floor {room.floor} • {room.type}
                  </div>

                  {/* Occupancy Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>Occupancy</span>
                      <span className="font-mono">
                        {room.occupancy} / {room.capacity} beds
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isFull
                            ? 'bg-rose-500'
                            : room.occupancy > 0
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(room.occupancy / room.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium"
                    >
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-medium self-center">
                      +{room.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Room {selectedRoom.roomNumber} ({selectedRoom.block})
              </h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Floor & Wing:</span>
                <span className="font-bold text-slate-800">Floor {selectedRoom.floor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Room Type:</span>
                <span className="font-bold text-slate-800">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Monthly Rent:</span>
                <span className="font-bold text-slate-800">₹{selectedRoom.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Occupancy:</span>
                <span className="font-bold text-slate-800">
                  {selectedRoom.occupancy} of {selectedRoom.capacity} Beds filled
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Assigned Residents:</span>
                {store.students.filter((s) => (s.roomNumber || s.room) === selectedRoom.roomNumber).length === 0 ? (
                  <p className="text-slate-400 italic">No students allocated yet.</p>
                ) : (
                  store.students
                    .filter((s) => (s.roomNumber || s.room) === selectedRoom.roomNumber)
                    .map((stu) => (
                      <div
                        key={stu.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between mb-1"
                      >
                        <span className="font-bold text-slate-800">{stu.name}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{stu.studentId}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedRoom(null)}
              className="mt-2 w-full py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Room</h3>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    placeholder="e.g. A405"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Block</label>
                  <select
                    value={newRoom.block}
                    onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as any })}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Single AC">Single AC</option>
                  <option value="Double AC">Double AC</option>
                  <option value="Double Non-AC">Double Non-AC</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                  <option value="Four Sharing">Four Sharing</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
