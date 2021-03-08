package fr.vulture.hostocars.entity;

import org.junit.jupiter.api.DisplayName;

/**
 * Test class for the {@link OperationLine} class.
 */
@DisplayName("Operation line entity")
class OperationLineTest extends EntityTest<OperationLine> {

    /**
     * {@inheritDoc}
     */
    @Override
    Class<OperationLine> getTestClass() {
        return OperationLine.class;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    OperationLine constructTestObject() {
        return new OperationLine();
    }

}
