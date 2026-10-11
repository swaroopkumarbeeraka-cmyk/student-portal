import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users2,
  Building,
  BookOpen,
  HeartPulse,
  Bus,
  Utensils,
  Wifi,
  Dumbbell,
  Landmark,
  Calendar,
  Send,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FacilityData } from '../../types';
import { dataService } from '../../services/dataService';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  HeartPulse,
  Building,
  Bus,
  Utensils,
  Dumbbell,
  Wifi,
  Landmark
};

export const StudentCornerPage: React.FC = () => {
  const { hallBookings, addHallBooking } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();

  const isSeminarHallView = location.pathname.includes('/seminar-halls');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [facilityName, setFacilityName] = useState('Seminar Hall 1 (Dr. APJ Abdul Kalam Hall)');
  const [eventTitle, setEventTitle] = useState('');
  const [organizingBody, setOrganizingBody] = useState('AI & Data Science Student Chapter');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 04:30 PM');
  const [attendees, setAttendees] = useState(100);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [facilities, setFacilities] = useState<FacilityData[]>(() => dataService.getInitialSeedData().facilities);

  useEffect(() => {
    dataService.getFacilities().then(setFacilities).catch(console.error);
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !bookingDate) return;

    addHallBooking({
      facilityName,
      eventTitle: eventTitle.trim(),
      organizingBody,
      date: bookingDate,
      timeSlot,
      expectedAttendees: Number(attendees)
    });

    setEventTitle('');
    setBookingDate('');
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
    }, 1200);
  };

  if (isSeminarHallView) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Student Corner', path: '/student-corner' },
            { label: 'Seminar Halls & Auditorium' }
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-app-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
              Auditorium & Seminar Halls Booking Desk
            </h1>
            <p className="text-xs text-app-muted mt-0.5">
              Submit reservation inquiries for club events, technical symposiums, and departmental workshops
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBookingModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Hall Reservation Request
          </Button>
        </div>

        {/* Existing Bookings List */}
        <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
          <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
            Registered Reservation Inquiries ({hallBookings.length})
          </h2>

          <div className="divide-y divide-app-border text-xs">
            {hallBookings.map((b) => (
              <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-app-text">{b.eventTitle}</span>
                    <Badge variant="accent" size="sm">{b.organizingBody}</Badge>
                  </div>
                  <p className="text-app-muted">
                    {b.facilityName} • Date: <span className="font-mono text-app-text font-medium">{b.date}</span> ({b.timeSlot})
                  </p>
                  <p className="text-[11px] text-app-muted">
                    Attendees: ~{b.expectedAttendees} • Submitted: {b.submittedDate}
                  </p>
                </div>

                <Badge
                  variant={
                    b.status === 'Confirmed'
                      ? 'success'
                      : b.status === 'Rejected'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Modal */}
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title="Reserve Seminar Hall / Auditorium"
          subtitle="Submitted to Estate Officer"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            {bookingSuccess ? (
              <div className="p-4 bg-app-success/10 border border-app-success/20 rounded text-center text-app-success space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto" />
                <p className="font-semibold">Inquiry Filed Successfully</p>
                <p className="text-[11px] text-app-muted">Assigned to Campus Facilities Desk for slot verification.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="block font-medium text-app-text mb-1">Facility Target</label>
                  <select
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
                  >
                    <option value="Seminar Hall 1 (Dr. APJ Abdul Kalam Hall)">Seminar Hall 1 (Capacity 150)</option>
                    <option value="Seminar Hall 2 (Sir MV Hall)">Seminar Hall 2 (Capacity 250)</option>
                    <option value="Main Central Auditorium">Main Central Auditorium (Capacity 1,200)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-app-text mb-1">Event Title</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. AI Chapter Hackathon Ideation"
                    className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-app-text mb-1">Organizing Body / Student Club</label>
                  <input
                    type="text"
                    value={organizingBody}
                    onChange={(e) => setOrganizingBody(e.target.value)}
                    className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-app-text mb-1">Event Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-app-text mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
                    >
                      <option value="09:30 AM - 12:30 PM">09:30 AM - 12:30 PM</option>
                      <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM</option>
                      <option value="Full Day (09:00 - 05:00)">Full Day (09:00 - 05:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-app-text mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    value={attendees}
                    onChange={(e) => setAttendees(Number(e.target.value))}
                    min={10}
                    max={1200}
                    className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text font-mono"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsBookingModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  // General Student Corner Directory
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Student Corner' }]} />

      <div className="pb-2 border-b border-app-border">
        <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
          Campus Facilities & Student Services
        </h1>
        <p className="text-xs text-app-muted mt-0.5">
          Directory of student amenities, health centers, residential hostels, and transport
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((fac) => {
          const Icon = ICON_MAP[fac.iconName] || Building;
          return (
            <div
              key={fac.id}
              className="p-5 bg-app-surface border border-app-border rounded flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 text-app-accent">
                  <div className="p-2 bg-app-bg rounded border border-app-border">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-semibold text-app-text">{fac.name}</h2>
                </div>
                <p className="text-xs text-app-muted leading-relaxed">{fac.desc}</p>
              </div>

              <div className="pt-3 border-t border-app-border flex items-center justify-between text-xs">
                {fac.id === 'seminar-halls' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/student-corner/seminar-halls')}
                  >
                    Open Reservation Desk
                  </Button>
                ) : (
                  <span className="text-[11px] text-app-muted italic">
                    Information will appear here when published
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
