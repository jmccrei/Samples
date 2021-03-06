<?php

namespace CoreSys\SiteBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * SliderRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SliderRepository extends EntityRepository
{

    public function findAll()
    {
        $q = $this->createQueryBuilder( 's' )
             ->orderBy( 's.position', 'asc' )
             ->getQuery();

        return $q->getResult();
    }

    public function getActiveSliders( $count = NULL )
    {
        $q = $this->createQueryBuilder( 's' )
             ->where( 's.active = :active' )
             ->setParameter( 'active', TRUE )
             ->orderBy( 's.position', 'ASC' );

        if ( !empty( $count ) ) {
            $q->setMaxResults( intval( $count ) );
        }

        $q = $q->getQuery();

        return $q->getResult();
    }
}
