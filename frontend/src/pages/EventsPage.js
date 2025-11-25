import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import "../styles/EventsPage.css";


export default function EventsPage({ admin = false }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    event_date: "",
    start_time: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data))
      .catch((e) => console.error(e));
  }, []);

  const addEvent = async () => {
    if (!form.title) return alert("Title required");
    try {
      await api.post("/events", form);
      alert("Event added");
      setForm({
        title: "",
        description: "",
        venue: "",
        event_date: "",
        start_time: "",
      });
      const r = await api.get("/events");
      setEvents(r.data);
    } catch (err) {
      alert("Error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="events-header-left">
          <i className="fa fa-calendar header-icon" />
          <span className="events-title">Manage Events</span>
        </div>

        {admin && (
          <button
            className="event-open-modal-btn"
            onClick={() => setShowModal(true)}
          >
            <i className="fa fa-plus icon-margin" /> Add Event
          </button>
        )}
      </div>

      {admin && showModal && (
        <div className="event-modal-overlay">
          <div className="event-modal">
            <div className="event-modal-header">
              <i className="fa fa-calendar" /> Add New Event
              <button
                className="event-modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fa fa-times" />
              </button>
            </div>

            <form
              className="event-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                addEvent();
                setShowModal(false);
              }}
            >
              <div className="event-modal-form-full">
                <label>
                  <i className="fa fa-heading" /> Event Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Event Title"
                />
              </div>

              <div>
                <label>
                  <i className="fa fa-calendar-day" /> Date
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label>
                  <i className="fa fa-clock" /> Time
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                />
              </div>

              <div className="event-modal-form-full">
                <label>
                  <i className="fa fa-map-marker-alt" /> Venue
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) =>
                    setForm({ ...form, venue: e.target.value })
                  }
                />
              </div>

              <div className="event-modal-form-full">
                <label>
                  <i className="fa fa-align-left" /> Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="event-modal-actions event-modal-form-full">
                <button className="event-modal-btn" type="submit">
                  <i className="fa fa-save icon-margin" /> Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="event-list">
        {events.map((ev) => (
          <div key={ev.id} className="event-card">
            <div className="event-card-header">
              <i className="fa fa-calendar-day header-blue" />
              <span className="event-title">{ev.title}</span>
            </div>

            <div className="event-description">{ev.description}</div>

            <div className="event-details">
              <i className="fa fa-calendar" /> {ev.event_date} &nbsp;
              <i className="fa fa-clock" /> {ev.start_time} &nbsp;
              <i className="fa fa-map-marker-alt" /> {ev.venue}
            </div>

            {admin && (
              <button
                className="event-delete-btn"
                onClick={() => remove(ev.id)}
              >
                <i className="fa fa-trash icon-margin" /> Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
