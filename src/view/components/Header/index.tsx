import s from "./index.module.scss";
import Logo from "../../../assets/images/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import {
  useActions,
  useAppDispatch,
  useAppSelector,
} from "../../../common/helpers/reduxHook";
// import { QuizThunks } from "../../../store/thunks/quiz.thunks";
import { QuizActions, QuizState } from "../../../store/reducers/quiz.reducer";

export const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const { addQuizAnswerThunk } = useThunks(QuizThunks);
  const { setQuizListAction } = useActions(QuizActions);
  const { quizList } = useAppSelector(QuizState);

  const [differentTime, setDifferentTime] = useState<string>("00:00");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [changeText, ] = useState(true);

  useEffect(() => {
    const firstTime = localStorage.getItem("firstTime");
    if(firstTime) {
      const interval = setInterval(() => {
        let currentTime = Number(Date.now());
        let different = currentTime - Number(firstTime);
        let hours = Math.floor((different) / 3600000);
        let minutes = Math.floor(((different % 86400000) % 3600000) / 60000);
        let result =
          (hours > 9 ? hours : `0${hours}`) +
          ":" +
          (minutes > 9 ? minutes : `0${minutes}`);
        console.log(result)
        setDifferentTime(result);
        return () => clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [location.pathname, quizList?.firstSymptomsDate, quizList?.firstSymptomsTimeHh, quizList?.firstSymptomsTimeMm]);
 
  const onClickLogoHandler = () => {
    if (location.pathname === "/") return;
    setIsOpenModal(true);
  };

  const onClickCloseBtnHandler = () => {
    dispatch(setQuizListAction(null));
    localStorage.removeItem("application_number");
    localStorage.removeItem("id");
    localStorage.removeItem("start_time");
    localStorage.removeItem("start_time_auto");
    localStorage.removeItem("firstTime");
    setIsOpenModal(false);
    navigate("/");
  };

  return (
    <header className={s.Header}>
      <div className={s.logoBox} onClick={onClickLogoHandler}>
        <img src={Logo} alt="Логотип" />
      </div>
      {location.pathname === "/" ? (
        <div className={s.titleBox}>
          <h1>
            Алгоритм оказания помощи <br /> при ИНСУЛЬТЕ В ОСТРОМ ПЕРИОДЕ
          </h1>
        </div>
      ) : (
        <div className={s.timeBox}>
          <div className={s.title}>
            {changeText === true ? (
              <span>
                С момента <br /> начала заполнения чек-листа
              </span>
            ) : (
              <span>
                С момента <br /> появления симптомов
              </span>
            )}
          </div>
          <div className={s.time}>
            <div className={s.hours}>
              <span>
                {differentTime.split(":")[0]}
              </span>
              <span className={s.unit}>часов</span>
            </div>
            <span className={s.delimeter}>:</span>
            <div className={s.minutes}>
              <span>
              {differentTime.split(":")[1]}
              </span>
              <span className={s.unit}>минут</span>
            </div>
          </div>
        </div>
      )}
      <Modal
        isVisible={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        content={
          <p>
            Вы уверены что хотите выйти в стартовый экран без сохранения
            чек-листа?
          </p>
        }
        footer={
          <Button classname={s.homeBtn} onClick={onClickCloseBtnHandler}>
            Выйти без сохранения
          </Button>
        }
      />
    </header>
  );
};
