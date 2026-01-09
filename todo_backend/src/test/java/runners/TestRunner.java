package runners;

import io.cucumber.junit.platform.engine.Constants;
import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.Suite;

@Suite
@ConfigurationParameter(
    key = Constants.GLUE_PROPERTY_NAME,
    value = "step_definitions"
)
@ConfigurationParameter(
    key = Constants.FEATURES_PROPERTY_NAME,
    value = "src/test/resources/features"
)
@ConfigurationParameter(
    key = Constants.PLUGIN_PROPERTY_NAME,
    value = "pretty, json:target/cucumber-reports/cucumber.json, html:target/cucumber-reports/index.html"
)
public class TestRunner {
}
