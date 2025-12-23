using System;
using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Dictionary.Domain.Entities;

/// <summary>
/// Dictionary entry - word definition
/// </summary>
public class DictionaryEntry : BaseEntity
{
    public string Word { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = "tr"; // tr, en, ar
    public string Definition { get; set; } = string.Empty;
    public string? Pronunciation { get; set; } // IPA notation
    public string? AudioUrl { get; set; }
    public string? PartOfSpeech { get; set; } // noun, verb, adjective, etc.
    public string[]? Examples { get; set; } // Example sentences
    public string[]? Synonyms { get; set; }
    public string[]? Antonyms { get; set; }
    public string? Etymology { get; set; }
    public string? ImageUrl { get; set; }
    
    // Lemmatization (optional)
    public string? Lemma { get; set; } // Root form
    
    // Metadata
    public new string? Metadata { get; set; }
    // { "difficulty": "intermediate", "frequency": "common" }
}

