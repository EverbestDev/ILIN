import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Users,
  Video,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Mock events - replace with real data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Client Meeting - ABC Corp",
      type: "meeting",
      date: new Date(2025, 0, 2, 10, 0),
      duration: 60,
      location: "Office - Room 301",
      attendees: ["John Doe", "Jane Smith"],
      description: "Discuss new translation project requirements",
      status: "scheduled",
    },
    {
      id: 2,
      title: "Video Call - Translation Review",
      type: "video-call",
      date: new Date(2025, 0, 2, 14, 30),
      duration: 45,
      location: "Zoom Meeting",
      attendees: ["Sarah Chen"],
      description: "Review completed German translation",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Project Deadline - Legal Documents",
      type: "deadline",
      date: new Date(2025, 0, 5, 17, 0),
      duration: 0,
      location: "N/A",
      attendees: [],
      description: "Final delivery of legal document translation",
      status: "pending",
    },
    {
      id: 4,
      title: "Phone Consultation",
      type: "phone-call",
      date: new Date(2025, 0, 8, 11, 0),
      duration: 30,
      location: "+1 (555) 123-4567",
      attendees: ["Michael Brown"],
      description: "Initial consultation for website localization",
      status: "scheduled",
    },
  ]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "meeting":
        return Users;
      case "video-call":
        return Video;
      case "phone-call":
        return Phone;
      case "deadline":
        return FileText;
      default:
        return Calendar;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "video-call":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "phone-call":
        return "bg-green-100 text-green-700 border-green-200";
      case "deadline":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
    showNotification("Event deleted successfully", "success");
  };

  const stats = {
    total: events.length,
    today: events.filter((e) => {
      const today = new Date();
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: events.filter((e) => {
      const today = new Date();
      const eventDate = new Date(e.date);
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length,
    pending: events.filter((e) => e.status === "pending").length,
  };

  // Get events for selected date
  const getEventsForDate = (date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const todaysEvents = getEventsForDate(new Date());
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule & Events
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your meetings, calls, and deadlines
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-500">TOTAL</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-1">All Events</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-gray-500">TODAY</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
          <p className="text-xs text-gray-600 mt-1">Events Today</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-gray-500">THIS WEEK</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
          <p className="text-xs text-gray-600 mt-1">Coming Up</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-gray-500">PENDING</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          <p className="text-xs text-gray-600 mt-1">Need Action</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Today's Schedule
            </h2>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        <EventIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {new Date(event.date).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                                {event.duration > 0 &&
                                  ` (${event.duration} min)`}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                No events scheduled for today
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Your calendar is clear!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        <EventIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No upcoming events</p>
            </div>
          )}
        </div>
      </div>

      {/* All Events List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50/30">
          <h2 className="text-xl font-bold text-gray-900">All Events</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                return (
                  <tr
                    key={event.id}
                    className="hover:bg-green-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventTypeColor(
                            event.type
                          )}`}
                        >
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {event.title}
                          </p>
                          {event.attendees.length > 0 && (
                            <p className="text-sm text-gray-600">
                              {event.attendees.length} attendee
                              {event.attendees.length > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {event.type.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-600">
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                {(() => {
                  const EventIcon = getEventTypeIcon(selectedEvent.type);
                  return (
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <EventIcon className="w-6 h-6 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Event Details
                  </h2>
                  <p className="text-green-100 text-sm capitalize">
                    {selectedEvent.type.replace("-", " ")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-xl text-gray-900 mb-4">
                  {selectedEvent.title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEvent.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEvent.date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                        {selectedEvent.duration > 0 &&
                          ` - ${selectedEvent.duration} minutes`}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.attendees.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Attendees</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedEvent.attendees.map((attendee, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                            >
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border mt-1 ${getStatusColor(
                          selectedEvent.status
                        )}`}
                      >
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-all"
              >
                Close
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(selectedEvent);
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Add New Event</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-center text-gray-600 py-8">
                Event creation form will be implemented here with form fields
                for title, type, date, time, location, attendees, and
                description.
              </p>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  showNotification("Event created successfully", "success");
                }}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 mx-auto mb-4 shadow-lg">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Delete Event?
              </h3>
              <p className="text-gray-600 text-center mb-2">
                You're about to delete:
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-center font-semibold text-gray-900">
                  {deleteConfirm.title}
                </p>
              </div>
              <p className="text-sm text-red-600 text-center mb-6 font-medium">
                ⚠️ This action cannot be undone
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteConfirm.id)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium transition-all shadow-lg"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Schedules;
