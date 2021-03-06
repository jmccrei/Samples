<?php
/**
 * This file is part of the CoreSysUserBundle package.
 * (c) J&L Core Systems http://jlcoresystems.com | http://joshmccreight.com
 */

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//namespace FOS\UserBundle\Form\Type;
namespace CoreSys\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Security\Core\Validator\Constraint\UserPassword;

/**
 * Class UserType
 * @package CoreSys\UserBundle\Form
 */
class UserType extends AbstractType
{

    /**
     * @var
     */
    private $class;

    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm( FormBuilderInterface $builder, array $options )
    {
        $this->buildUserForm( $builder, $options );
        $builder->add( 'sys_roles', 'entity', array(
            'class'       => 'CoreSys\UserBundle\Entity\Role',
            'property'    => 'name',
            'empty_value' => NULL,
            'required'    => FALSE,
            'multiple'    => TRUE,
            'label'       => 'Account Level',
            'attr'        => array(
                'class' => 'form-control'
            )
        ) );;
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions( OptionsResolverInterface $resolver )
    {
        $resolver->setDefaults( array(
//            'data_class' => $this->class,
                                    'intention' => 'create',
                                ) );
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'coresys_user_type';
    }

    /**
     * Builds the embedded form representing the user.
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    protected function buildUserForm( FormBuilderInterface $builder, array $options )
    {
        $builder
            ->add( 'username', NULL, array( 'label' => 'Login', 'translation_domain' => 'FOSUserBundle', 'attr' => array( 'data-postdesc' => 'The desired username' ) ) )
            ->add( 'email', 'email', array( 'label' => 'Email Address', 'translation_domain' => 'FOSUserBundle', 'attr' => array( 'data-postdesc' => 'The email address for this user.' ) ) )
            ->add( 'plainPassword', 'repeated', array(
                'type'            => 'password',
                'options'         => array( 'translation_domain' => 'FOSUserBundle', 'attr' => array( 'data-postdesc' => 'Password and confirm-password' ) ),
                'first_options'   => array( 'label' => 'Password' ),
                'second_options'  => array( 'label' => 'Confirm Password' ),
                'invalid_message' => 'fos_user.password.mismatch' ) )//            ->add('first_name', null, array('required' => false, 'attr' => array( 'data-postdesc' => 'The users first name' ) ) )
//            ->add('last_name', null, array('required' => false, 'attr' => array( 'data-postdesc' => 'The users last name' ) ) )
        ;
    }
}