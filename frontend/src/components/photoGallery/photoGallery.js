import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import api from '../../constants/api';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.backgroundDarker};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PhotoCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.backgroundLighter};
  box-shadow: 0 12px 36px rgba(0,0,0,0.04);
  aspect-ratio: 1 / 1;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const SpinnerWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 26px;
  height: 26px;
  border: 4px solid ${({ theme }) => theme.colors.backgroundDarker}33;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ErrorBox = styled.div`
  background: ${({ theme }) => theme.colors.errorBackground || '#ffe9e9'};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder || '#ff4f4f'};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover:not([disabled]) {
    filter: brightness(1.05);
  }
`;

const InfoText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;


const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPageLabel, setCurrentPageLabel] = useState('1');

  const fetchPage = useCallback(async (url = "/invitations/guest-photos/list/") => {
    setPageLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      const data = res.data;
      setPhotos(data.results.photos);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCount(data.count);

      // derive current page from `next`/`previous` if possible
      if (data.next) {
        const nextParam = new URL(data.next, window.location.origin).searchParams.get('page');
        const pageNum = nextParam ? Math.max(Number(nextParam) - 1, 1) : '1';
        setCurrentPageLabel(String(pageNum));
      } else if (data.previous) {
        const prevParam = new URL(data.previous, window.location.origin).searchParams.get('page');
        const pageNum = prevParam ? Number(prevParam) + 1 : '1';
        setCurrentPageLabel(String(pageNum));
      } else {
        setCurrentPageLabel('1');
      }
    } catch (e) {
      console.error("Failed to fetch gallery", e);
      setError("Could not load photos. Please try again.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return (
    <Container>
      <Title>Guest Photo Gallery</Title>

      {pageLoading && (
        <SpinnerWrapper>
          <Spinner aria-label="Loading photos" />
        </SpinnerWrapper>
      )}

      {error && (
        <ErrorBox role="alert">
          <div>{error}</div>
          <RetryButton onClick={() => fetchPage()}>
            <RefreshCw size={16} /> Retry
          </RetryButton>
        </ErrorBox>
      )}

      {!pageLoading && !error && photos.length === 0 && (
        <InfoText>No photos uploaded yet.</InfoText>
      )}

      <Grid>
        {photos.map(p => (
          <PhotoCard key={p.id}>
            <Photo src={p.image_url} alt={`Guest upload ${p.id}`} loading="lazy" />
          </PhotoCard>
        ))}
      </Grid>

      <PaginationBar>
        <PageButton
          onClick={() => prevUrl && fetchPage(prevUrl)}
          disabled={!prevUrl || pageLoading}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} /> Previous
        </PageButton>

        <InfoText>
          Page {currentPageLabel} of {Math.ceil(count / 20) || 1} &middot; {count} photo
          {count !== 1 ? 's' : ''}
        </InfoText>

        <PageButton
          onClick={() => nextUrl && fetchPage(nextUrl)}
          disabled={!nextUrl || pageLoading}
          aria-label="Next page"
        >
          Next <ChevronRight size={16} />
        </PageButton>
      </PaginationBar>
    </Container>
  );
};

export default Gallery;
