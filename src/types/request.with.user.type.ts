type User = {
  user: {
    email: string
  }
};


type RequestWithUser = Request & User;

export default RequestWithUser;
