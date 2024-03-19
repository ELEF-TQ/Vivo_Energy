import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../../context/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews } from '../../../context/features/ReviewSlice';
import moment from 'moment';
import defaultIMG from '../../../assets/images/defaultUser.png';
import { getPompisteByMatriculeRH } from '../../../context/features/PompisteSlice';
import Spinner from '../../../components/status/Spinner';

const ReviewsPompiste = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews);
  const pompiste: any = useSelector((state: RootState) => state.pompistes.pompiste);
  const {matriculeRH} = useParams();
  const noReviews = reviews.reviews.length === 0;
  console.log(matriculeRH);
  console.log(pompiste)

  const calculateDuration = (reviewDate: Date) => {
    const now = moment();
    const reviewDateTime = moment(reviewDate);
    const duration = moment.duration(now.diff(reviewDateTime));
    const formattedDuration = duration.humanize();
    return formattedDuration;
  };

  useEffect(() => {
    dispatch(getAllReviews(matriculeRH));
    dispatch(getPompisteByMatriculeRH(matriculeRH as string))
  }, [matriculeRH]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-3xl font-bold mb-4">Évaluations sur Pompistes</h1>

      {reviews.isLoading && (
          <Spinner/>
      )}

      {
        pompiste && (
          <>
            <div className="modal-content border my-10 border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row justify-center items-center">
              <div className="photo-wrapper mr-16 p-2">
                <img
                  src={pompiste?.image?.buffer ? `data:image/png;base64,${pompiste?.image.buffer}` : defaultIMG}
                  alt="default"
                  className="w-32 h-32 rounded-full mx-auto ring-2 ring-gray-300"
                />
                <div className="text-center my-4"> {/* Added class 'text-center' and margin */}
                  <h3 className="text-xl font-medium leading-8">{pompiste.username}</h3>
                  <div className="text-gray-600 text-xs font-semibold">
                    #{pompiste.matriculeRH}
                  </div>
                </div>
              </div>
              <div className="p-2 flex ml-16 flex-col items-center">
                <div className="grid grid-cols-2 gap-4 justify-between">
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">CIN</p>
                    <p>{pompiste.CIN}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">Phone</p>
                    <p>{pompiste.phone}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">Email</p>
                    <p>{pompiste.email}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">Score</p>
                    <p>{pompiste.score}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">Etoiles</p>
                    <p>{pompiste.etoiles}</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-gray-700 font-semibold">Solde</p>
                    <p>{pompiste.solde}</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4 mt-10">Avis associées au pompiste:</h2>
          </>
        )
      }

      {!reviews.isLoading && noReviews && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              Aucun Evaluations pour le pompiste {matriculeRH}
            </p>
          </div>
        </div>
      )}

      {!reviews.isLoading &&
        !noReviews &&
        [...reviews.reviews]
        .sort((reviewA: { dateReview: Date }, reviewB: { dateReview: Date }) => new Date(reviewB.dateReview).getTime() - new Date(reviewA.dateReview).getTime())
        .map((review: any) => (
          <div
            key={review._id}
            className="flex flex-col sm:flex-row border-b-2 border-green-500 p-4 mb-4 items-center justify-between rounded-lg shadow-md bg-white cursor-pointer hover:bg-slate-100 transition duration-300 ease-in-out"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Avatar
                src={review.client.image?.buffer ? `data:image/png;base64,${review.client.image?.buffer}` : defaultIMG}
                alt="Avatar"
                sx={{ marginRight: '16px' }}
                className="w-32 h-32 rounded-full mx-auto ring-2 ring-green-500"
              />
              <div style={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {review.client.username}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(0, 0, 0, 0.54)' }}>
                  <Typography variant="body2" sx={{ marginRight: '8px' }}>
                  {calculateDuration(review.dateReview)} ago
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: "#FFB400", marginRight: '4px' }} />
                    <Typography variant="body2">{review.etoiles} étoile(s)</Typography>
                  </div>
                </div>
                <Typography variant="body1">
                  {review.commentaire}
                  {/* Hey guys, I hope this example comment is helping you read this documentation. */}
                </Typography>
              </div>
            </div>
          </div>
          ))
      }
    </div>
  )
}

export default ReviewsPompiste;
