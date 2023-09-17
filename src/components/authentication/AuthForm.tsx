import { useCallback, useState } from "react";
import {
  Form,
  useSearchParams,
  Link,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router-dom";
import { API_KEY_PRODUCTION, API_URL } from "../../Constant";
import { ApiFetchService } from "../../service/ApiFetchService";
import "./AuthForm.css";
import { ConnectedProps, connect } from "react-redux";
import { Profile, setProfile, setToken } from "../../redux/reducer";

interface Data {
  errors?: { [key: string]: string };
  message?: string;
}

const mapstateToProps = (state: { token: any }) => {
  return {};
};

const mapDispatchToProps = (dispatch: (arg0: any) => void) => {
  return {
    setToken: (token: any) => {
      dispatch(setToken(token));
    },
    setProfile: (profile: Profile) => {
      dispatch(setProfile(profile));
    },
  };
};

const connectToStore = connect(mapstateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connectToStore>;

const AuthForm = (props: Props) => {
  // const [isLogin, setIsLogin] = useState(true);
  // const switchAuthHandler = () => {
  //     setIsLogin((login)=> !login);
  // }

  // const datas = useActionData();
  // const data = datas as Data;
  // console.log(data);
  // const navigate = useNavigation();
  // const [searchParams] = useSearchParams();
  // const isLogin = searchParams.get('mode') === 'login';
  // const submitting = navigate.state === 'submitting';

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(" ");

  const changeUserName = (event: any) => {
    setUserName(event.target.value);
  };
  const changePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const clickedLogin = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchLogin();
    }
  }, [userName, password]);

  const fetchLogin = async () => {
    let formData = new FormData();
    formData.append("email", userName);
    formData.append("password", password);
    await ApiFetchService(API_URL + `custom/admin/login`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then(async (response: any) => {
      if (response.code == 200) {
        props.setToken(response.data.jwtToken);
        console.log(response);
        props.setProfile({
          id: response.data.id,
          username: response.data.fullname,
          email: response.data.email,
        });
        navigate("/category");
      }
    });
  };

  const onValidate = (): boolean => {
    let userName1 = true;
    let password1 = true;
    switch (true) {
      case !userName.trim():
        userName1 = false;
        setErrorMessage("Please fill email");
        break;
      case !password.trim():
        password1 = false;
        setErrorMessage("Please fill password");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return userName1 && password1;
  };

  return (
    <>
      <div className="form">
        {/* <h1>{isLogin ? 'Log in' : 'Create Account'}</h1>
                {data && data.errors && (
                    <ul>
                        {Object.values(data.errors).map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                )}
                {data && data.message && <p>{data.message}</p>} */}
        <label
          style={{
            color: "red",
            alignSelf: "center",
            marginTop: 24,
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {errorMessage}
        </label>
        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            onChange={changeUserName}
          />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            onChange={changePassword}
          />
        </p>
        <div className="actions">
          <button onClick={clickedLogin}>Login</button>
        </div>
      </div>
    </>
  );
};

export default connectToStore(AuthForm);
