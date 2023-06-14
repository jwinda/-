import HotPortfolio from '../../components/Home/HotPortfolio';
import Banner from '../../components/Home/Banner';
import NewPosts from '../../components/Home/NewPosts';
import BestStacks from '../../components/Home/BestStacks';
import Footer from '../../components/Footer';
import { useEffect } from 'react';

export default function Main() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Banner />
      <NewPosts />
      <HotPortfolio />
      <BestStacks />
      <Footer />
    </div>
  );
}
