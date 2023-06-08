import { useEffect, useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { loginAtom, userStackListState } from '../../recoil/loginState';
import { RiAddCircleFill } from 'react-icons/ri';
import { getUserProfile, updateUserProfile } from '../../apis/Fetcher';
import Stack from "../../components/Stack";
import ROUTES from '../../constants/Routes';
import styles from './updateUser.module.scss';

function UpdateUser() {
  const [userInfo, setUserInfo] = useRecoilState(loginAtom);
  const [stackList, setStackList] = useRecoilState(userStackListState);
  const [imageFile, setImageFile] = useState<File>();
  const [isValid, setIsValid] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const MAX_NAME_COUNT = 50;
  const MAX_INTRO_COUNT = 250;
  const MAX_CAREER_COUNT = 50;

  const handleImageChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUserInfo((prev) => ({
          ...prev,
          user_img: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetStackList = (stacks: string[]) => {
    setStackList(stacks);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    max: number
  ) => {
    const { name, value } = e.target;
    if (value.length <= max) {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isValid && window.confirm('수정하시겠습니까?')) {
      try {
        const formData = new FormData();

        formData.append('user_img', imageFile as File);
        formData.append('user_name', userInfo.user_name.trim());
        formData.append('user_introduction', userInfo.user_introduction);
        formData.append('user_career_goal', userInfo.user_career_goal);
        formData.append('user_stacks', JSON.stringify(stackList || []));

        await updateUserProfile(formData);

        navigate(`${ROUTES.MY_PAGE}`);
      } catch (error) {
        alert('수정을 실패했습니다.');
      }
    }
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (window.confirm('취소 하시겠습니까?')) {
      navigate(`${ROUTES.MY_PAGE}`);
    }
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUserProfile();
        setUserInfo((prev) => {
          return {
            ...prev,
            user_name: data.user_name,
            user_img: data.user_img,
            user_career_goal: data.user_career_goal,
            user_stacks: data.user_stacks,
            user_introduction:data.user_introduction,
          }
        });
        setStackList(data.user_stacks.stackList);
      } catch (error) {
        console.log(error);
      }
    };
  
    getUserData();
  }, []);

  useEffect(() => {
    setIsValid(userInfo.user_name.length !== 0);
  }, [userInfo.user_name]);

  return (
    <div className={styles.container}>
      {userInfo && (
        <form className={styles.form} encType="multipart/form-data">
          <div className={styles.imageContainer}>
            <img
              className={styles.image}
              src={userInfo.user_img}
              alt={userInfo.user_name}
              onClick={handleImageChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
              ref={fileInputRef}
            />
            <RiAddCircleFill className={styles.addButton} onClick={handleImageChange} />
          </div>
          <div className={styles.nameContainer}>
            <label className={styles.name}>이름</label>
            <input
              type="text"
              name="user_name"
              value={userInfo.user_name}
              placeholder="이름을 입력해 주세요."
              maxLength={MAX_NAME_COUNT}
              onChange={(e) => handleChange(e, MAX_NAME_COUNT)}
            />
            <p>{userInfo.user_name.length}/{MAX_NAME_COUNT}</p>
          </div>
          <div className={styles.introContainer}>
            <label>자기소개</label>
            <textarea
              name="user_introduction"
              value={userInfo.user_introduction}
              placeholder="자기소개를 입력해 주세요."
              maxLength={MAX_INTRO_COUNT}
              onChange={(e) => handleChange(e, MAX_INTRO_COUNT)}
            />
            <p>{userInfo.user_introduction.length}/{MAX_INTRO_COUNT}</p>
          </div>
          <div className={styles.CareerContainer}>
            <label>원하는 직군</label>
            <input
              type="text"
              name="user_career_goal"
              value={userInfo.user_career_goal}
              placeholder="원하는 직군을 입력해 주세요."
              maxLength={MAX_CAREER_COUNT}
              onChange={(e) => handleChange(e, MAX_CAREER_COUNT)}
            />
            <p>{userInfo.user_career_goal.length}/{MAX_CAREER_COUNT}</p>
          </div>
          <Stack selectedStack={stackList} setStackList={handleSetStackList} />
          <button 
            className={isValid ? styles.submitButton : styles.disabledButton} 
            onClick={handleSubmit} 
            disabled={!isValid}
          >
            완료
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateUser;