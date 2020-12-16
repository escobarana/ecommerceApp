package com.escobarana.ecommerce.config;

import com.escobarana.ecommerce.entity.Country;
import com.escobarana.ecommerce.entity.Product;
import com.escobarana.ecommerce.entity.ProductCategory;
import com.escobarana.ecommerce.entity.Province;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// Read-only API
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnsopportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for Product (Repository) making it read-only: PUT, POST and DELETE
        disableHttpMethods(Product.class, config, theUnsopportedActions);

        //disable HTTP methods for Product Category (Repository) making it read-only: PUT, POST and DELETE
        disableHttpMethods(ProductCategory.class, config, theUnsopportedActions);

        //disable HTTP methods for Country (Repository) making it read-only: PUT, POST and DELETE
        disableHttpMethods(Country.class, config, theUnsopportedActions);

        //disable HTTP methods for Province (Repository) making it read-only: PUT, POST and DELETE
        disableHttpMethods(Province.class, config, theUnsopportedActions);

        // call an internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsopportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsopportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsopportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
         // expose entity ids

        // - get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // -expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
