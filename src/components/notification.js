import notification from './feedback/notification';

const createNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};
export default createNotification;
