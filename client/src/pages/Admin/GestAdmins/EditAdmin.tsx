import React, {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../context/store';
import defaultIMG from '../../../assets/images/defaultUser.png'
import { RootState } from '../../../context/store';
import { emailRegex ,phoneRegex,usernameRegex } from '../../../lib/Regex';
import { Role } from '../../../types/Role';
import { fetchRoles } from '../../../context/features/RoleSlice';
import { fetchAdmins, updateAdmin } from '../../../context/features/AdminSlice';
interface Props {
  show: boolean;
  handleClose: () => void;
  Element: any;
}

interface FormData {
  image: any | null;
  username: string;
  CIN: string;
  phone: string;
  email: string;
  adminRole: string;
}

const EditAdmin: React.FC<Props> = ({ show, handleClose, Element }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { roles }: { roles: Role[] } = useSelector((state: RootState) => state.roles);

  const { isLoading } = useSelector((state: RootState) => state.pompistes);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    image: null,
    username: "",
    CIN: "",
    phone: "",
    email: "",
    adminRole: ""
  });

  useEffect(() => {
    setErrorMessage(null); 
    if (Element && show) {
    dispatch(fetchRoles())
      setFormData({
        username: Element.username,
        CIN: Element.CIN,
        phone: Element.phone,
        email: Element.email,
        image: Element.image,
        adminRole : Element.adminRole._id
      });
    } else {
      setFormData({
        image: null,
        username: "",
        CIN: "",
        phone: "",
        email: "",
        adminRole: "",
      });
    }
  }, [show, Element]);

 
  const handleSubmit = () => {
    const { username, adminRole, CIN, phone, email } = formData;

    if (!username || !adminRole || !CIN || !phone || !email) {
      setErrorMessage('Veuillez remplir tous les champs!');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      setErrorMessage('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    if (!usernameRegex.test(username)) {
      setErrorMessage('Veuillez saisir un nom d\'utilisateur valide.');
      return;
    }


    dispatch(updateAdmin({ Id: Element._id, formData })).then(() => {
      handleClose();
      setErrorMessage(null)

      dispatch(fetchAdmins());
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Check if the target is an input of type file
    if (e.target.nodeName === 'INPUT' && (e.target as HTMLInputElement).type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (name === 'image' && files && files.length > 0) {
        const selectedImage = files[0];
        setFormData(prevFormData => ({
          ...prevFormData,
          image: selectedImage
        }));
        return; // Exit early after handling file input
      }
    }
  
    // For other input types or select elements, update form data as usual
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  
    // If the input is not the image input and formData already contains an image, keep it in the state
    if (name !== 'image' && formData.image) {
      setFormData(prevFormData => ({
        ...prevFormData,
        image: formData.image
      }));
    }
  };
  
  
  
  return (
    <>
      {show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Modifier ADMIN</h3>
            </div>
            <div className="modal-content">
            <div className="flex items-center justify-center Margin__Input__Buttom">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image">
                <div className="image-container">
                  {formData.image ? (
                    <img
                      src={
                        formData.image instanceof File
                          ? URL.createObjectURL(formData.image)
                          : `data:image/png;base64,${formData.image.buffer.toString('base64')}`
                      }
                      alt="profile"
                      className="profile-image"
                    />
                  ) : (
                    <img src={defaultIMG} alt="default" className="default-image" />
                  )}
                </div>
              </label>
            </div>
            {/* Add button to remove the image */}
            {formData.image && (
              <div className="flex justify-center mt-2">
                <button
                  className="btn bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() => setFormData(prevFormData => ({ ...prevFormData, image: null }))}
                >
                  Supprimer l'image
                </button>
              </div>
            )}

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium Input_Label"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="Input__Style w-full"
                  placeholder="Nom"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

             
              <div className="mb-4">
                <label htmlFor="adminRole" className="block mb-2 text-sm font-medium Input_Label">
                    Rôle
                </label>
                <select
                    name="adminRole"
                    id="adminRole"
                    className="Input__Style w-full"
                    value={formData.adminRole}
                    onChange={handleChange}
                >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map(role => (
                    <option key={role._id} value={role._id}>
                        {role.name}
                    </option>
                    ))}
                </select>
                </div>

              <div className="mb-4">
                <label
                  htmlFor="CIN"
                  className="block mb-2 text-sm font-medium Input_Label"
                >
                  CIN
                </label>
                <input
                  type="text"
                  name="CIN"
                  id="CIN"
                  className="Input__Style w-full"
                  placeholder="CIN"
                  value={formData.CIN}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium Input_Label"
                >
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="Input__Style w-full"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium Input_Label"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="Input__Style w-full"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            {
              errorMessage && (
                <div className=" mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )
            }

           
            <div className="flex justify-between">
              <button
                className="btn bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                onClick={handleSubmit}
              >
                {isLoading ? 'En cours...' : 'Modifier'}
              </button>
              <button
                className="btn bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                onClick={handleClose}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAdmin;
