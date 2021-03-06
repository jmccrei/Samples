<?php

namespace CoreSys\MediaBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * ImageRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ImageRepository extends EntityRepository
{

    public function locateImage( $slug = NULL )
    {
        if ( empty( $slug ) ) {
            return NULL;
        }

        $image = $this->findOneById( $slug );
        if ( empty( $image ) ) {
            $q = $this->createQueryBuilder( 'i' )
                 ->where( 'i.filename LIKE :slug' )
                 ->setParameter( 'slug', $slug . '%' )
                 ->getQuery();

            $image = $q->getSingleResult();
        }

        return $image;
    }
}
