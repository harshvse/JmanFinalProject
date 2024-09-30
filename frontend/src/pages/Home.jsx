import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "../store";

const Home = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  // useEffect(() => {
  //   dispatch(userActions.getAll());
  // }, []);

  return <div>Home</div>;
};

export default Home;
