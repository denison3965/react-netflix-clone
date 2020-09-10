import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import './App.css'
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
export default () => {
 //Extraindo e formatando meus dados
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Pegando filme em destaque
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);
  
  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }
      else{
        setBlackHeader(false);
      }
    }


    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  //retornando o que serpa renderizado na tela 
  return (
    <div className="page">
      
      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData} />

      }

      <section className="Listas">
      {movieList.map((item,key) => (
        
        <MovieRow key={key} title={item.title} items={item.items} />

      ))}

      </section>

      <footer className="footer">
        Feito por <span style={{color: "red"}}>Denison de Almeida Portela</span><br/>
        Direitos de imagem para Netflix<br/>
        Dados pego do site Themoviedb.org
      </footer>
      {movieList.length <=0 &&
            <div className="loading">
              <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
            </div>
      }
    </div>
  );
}

