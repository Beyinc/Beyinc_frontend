import axiosInstance from "../Components/axiosInstance";

export const CalendarServices = {
  calenderAuth: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .get(`/calendar/calendarAuth`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  availability: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("availability service");
      axiosInstance
        .post(`/calendar/availability`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getAvailabilityData: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("get service");
      axiosInstance
        .post(`/calendar/getAvailabilityData`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveSettingsData: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("post save service");
      axiosInstance
        .post(`/calendar/saveSettingsData`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveSingleService: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("post save service");
      axiosInstance
        .post(`/calendar/saveSingleService`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  bookSession: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/book`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveBookData: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/saveBooking`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  mentorBookings: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/mentorBookings`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  userBookings: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/userBookings`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveWebinarService: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/createWebinar`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addWebinarUser: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/addWebinarUser`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  reschedule: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/reschedule`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  mentorReschedule: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/mentorReschedule`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  cancelBooking: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/cancelBooking`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addFeedback: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("calendar service");
      axiosInstance
        .post(`/calendar/addFeedback`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  deleteOneToOne: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("delete service", obj);
      axiosInstance
        .post(`/calendar/deleteSingleService`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },

  createRequest: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("request data", obj);
      axiosInstance
        .post(`/calendar/create-request`, obj)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },
   userBookingRequest: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("request data", obj);
      axiosInstance
        .get(`/calendar/user/pending`)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },
   mentorBookingRequest: (obj) => {
    return new Promise((resolve, reject) => {
      console.log("request data", obj);
      axiosInstance
        .get(`/calendar/mentor/pending`)
        .then((res) => {
          if (res) {
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  },
  updateRequestStatusByMentor: (obj) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put("/calendar/update-request", obj)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
},

  declineRequestByMentor: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put("/calendar/decline-request", obj)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },

  deleteRequestByMentor: (obj) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete("/calendar/deleteRequestByMentor", { data: obj })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
},



};

