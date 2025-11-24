namespace Zerquiz.Curriculum.Application.DTOs;

public class EducationModelDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class SubjectDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class TopicDto
{
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? ParentTopicId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int DisplayOrder { get; set; }
    public List<TopicDto>? SubTopics { get; set; }
}

public class LearningOutcomeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? GradeLevel { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string? TopicName { get; set; }
}

