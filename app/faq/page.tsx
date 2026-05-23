import type { Metadata } from 'next'
import FaqContent from './FaqContent'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular — İngilizce Öğrenme Kaynakları',
  description:
    'Çocuklara İngilizce öğretmek, minesminis platformunu kullanmak, çocuk gizliliği ve eğitim metodolojisi hakkında 25+ ailenin merak ettiği soruya kapsamlı yanıtlar.',
  alternates: { canonical: 'https://minesminis.com/faq' },
}

export default function FaqPage() {
  return <FaqContent />
}
